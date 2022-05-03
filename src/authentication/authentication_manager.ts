import createAuth0Client, { PopupCancelledError } from "@auth0/auth0-spa-js";
import { get } from "svelte/store";
import { access_token as acess_token_store, api_url, auth0_client, authentication_client_initialized, role as role_store, user } from "../stores";
import { Admin, Anonymous, LoggedUser } from "./roles";

const audience = "AUTH0_AUDIENCE";

const auth0_audience = { audience: audience };
const roles_key = "https://localhost:8090/roles";

export interface AuthenticationManager {
  initiate_client(): Promise<void>;
  login(login: string, password: string): Promise<void>;
  logout(): Promise<void>;
  store_credentials(): Promise<void>;
}

class LocalDevManager implements AuthenticationManager {
  initiate_client(): Promise<void> {
    user.set(undefined);
    authentication_client_initialized.set(true)
    return Promise.resolve();
  }

  login(_login: string, _password: string): Promise<void> {
    return Promise.resolve();
  }

  logout(): Promise<void> {
    user.set(null);
    role_store.set(null);
    return Promise.resolve();
  }

  store_credentials(): Promise<void> {
    user.set("test-user");
    role_store.set(new Admin());
    return Promise.resolve();
  }
}

class Auth0Manager implements AuthenticationManager {
  initiate_client(): Promise<void> {
    return (async () => {
      const response = await fetch("/auth_config.json");
      const config = await response.json();
      const client = await createAuth0Client({
        domain: config.domain,
        client_id: config.clientId,
        ...auth0_audience,
      });
      auth0_client.set(client);
      if (client !== null) {
        authentication_client_initialized.set(true)
      }
    })();
  }

  login(_login: string, _password: string): Promise<void> {
    return (async () => {
      try {
        await get(auth0_client).loginWithPopup({
          connection: "Username-Password-Authentication",
          ...auth0_audience,
        });
      } catch (error) {
        if (error instanceof PopupCancelledError) {
          // ignore
          return;
        }
        console.log(error);
      }
    })();
  }

  logout(): Promise<void> {
    // localOnly option fools auth0 client but when we try to login then
    // there is no option to specify login/password
    return (async () => {
      await get(auth0_client).logout({ returnTo: "AUTH0_LOGOUT_URL" });
    })();
  }

  store_credentials(): Promise<void> {
    return (async () => {
      const client = get(auth0_client);
      let user_info = await client.getUser({ ...auth0_audience });
      if (user_info != null) {
        user.set(user_info.nickname);
        const roles: string[] = user_info[roles_key] ?? [];
        if (roles.includes("admin")) {
          role_store.set(new Admin());
        } else if (roles.includes("user")) {
          role_store.set(new LoggedUser());
        } else {
          role_store.set(new Anonymous());
        }
      }
    })();
  }
}

class CustomEndpointManager implements AuthenticationManager {
  api_url: string;

  constructor() {
    this.api_url = get(api_url)
  }

  initiate_client(): Promise<void> {
    return (async () => {
      authentication_client_initialized.set(true)
    })();
  }

  login(login: string, password: string): Promise<void> {
    return (async () => {
      const response = await fetch(this.api_url + "auth/login", {
        method: "POST", mode: "cors", headers: {
          "Content-type": "application/json"
        }, body: JSON.stringify({ email: login, password })
      })
      if (response.ok) {
        const { message, access_token } = await response.json()
        if (message === 'logged in') {
          user.set(login)
          acess_token_store.set(access_token)
          const { role } = this.parseJwt(access_token)
          role_store.set(role == true ? new Admin() : new LoggedUser())
          return
        } else {
          console.log(message)
        }
      } else {
        const { message } = await response.json()
        console.log(message)
      }
      role_store.set(new Anonymous())
    })();
  }

  logout(): Promise<void> {
    return (async () => {
      user.set(null)
      role_store.set(new Anonymous())
      acess_token_store.set(null)
    })();
  }

  store_credentials(): Promise<void> {
    // handled in login
    return Promise.resolve()
  }

  parseJwt(token: string) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  };
}

export const authentication_manager: AuthenticationManager = new CustomEndpointManager();
