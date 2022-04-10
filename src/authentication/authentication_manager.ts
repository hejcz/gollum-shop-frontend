import createAuth0Client, { PopupCancelledError } from "@auth0/auth0-spa-js";
import { get } from "svelte/store";
import { environment } from "../environment";
import { auth0_client, role, user } from "../stores";
import { Admin, Anonymous, LoggedUser } from "./roles";

const audience = "AUTH0_AUDIENCE";

const auth0_audience = { audience: audience };
const roles_key = "https://localhost:8090/roles";

export interface AuthenticationManager {
  initiate_client(): Promise<void>;
  login(): Promise<void>;
  logout(): Promise<void>;
  store_credentials(): Promise<void>;
}

class LocalDevManager implements AuthenticationManager {
  initiate_client(): Promise<void> {
    // derived store checks strict null
    user.set(undefined);
    return Promise.resolve();
  }

  login(): Promise<void> {
    return Promise.resolve();
  }

  logout(): Promise<void> {
    user.set(null);
    role.set(null);
    return Promise.resolve();
  }

  store_credentials(): Promise<void> {
    user.set("test-user");
    role.set(new Admin());
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
    })();
  }

  login(): Promise<void> {
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
          role.set(new Admin());
        } else if (roles.includes("user")) {
          role.set(new LoggedUser());
        } else {
          role.set(new Anonymous());
        }
      }
    })();
  }
}

export const authentication_manager: AuthenticationManager =
  environment() === "local" ? new LocalDevManager() : new Auth0Manager();
