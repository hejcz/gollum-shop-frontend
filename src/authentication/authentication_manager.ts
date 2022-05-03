import { get } from "svelte/store";
import {
  access_token as acess_token_store,
  api_url,
  role as role_store,
  user,
} from "../stores";
import { Admin, Anonymous, LoggedUser } from "./roles";

export interface AuthenticationManager {
  login(login: string, password: string): Promise<void>;
  logout(): Promise<void>;
  store_credentials_if_authenticated(): Promise<void>;
  signup(username: string, password: string, email: string): Promise<void>;
}

class LocalDevManager implements AuthenticationManager {
  signup(_username: string, _password: string, _email: string): Promise<void> {
    console.log("singnup unavailable for a LocalDevManager");
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

  store_credentials_if_authenticated(): Promise<void> {
    user.set("test-user");
    role_store.set(new Admin());
    return Promise.resolve();
  }
}

class CustomEndpointManager implements AuthenticationManager {
  api_url: string;

  constructor() {
    this.api_url = get(api_url);
  }

  signup(username: string, password: string, email: string): Promise<void> {
    return (async () => {
      const response = await fetch(this.api_url + "user/add-user", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ email, password, username }),
      });
      if (response.ok) {
        const { message } = await response.json();
        if (message === "dodany") {
          await this.login(email, password);
          return;
        } else {
          console.log(message);
        }
      } else {
        const { message } = await response.json();
        console.log(message);
      }
    })();
  }

  login(login: string, password: string): Promise<void> {
    return (async () => {
      const response = await fetch(this.api_url + "auth/login", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ email: login, password }),
      });
      if (response.ok) {
        const { message, access_token } = await response.json();
        if (message === "logged in") {
          user.set(login);
          acess_token_store.set(access_token);
          const { role } = this.parseJwt(access_token);
          role_store.set(role == true ? new Admin() : new LoggedUser());
          return;
        } else {
          console.log(message);
        }
      } else {
        const { message } = await response.json();
        console.log(message);
      }
      role_store.set(new Anonymous());
    })();
  }

  logout(): Promise<void> {
    return (async () => {
      user.set(null);
      role_store.set(new Anonymous());
      acess_token_store.set(null);
    })();
  }

  store_credentials_if_authenticated(): Promise<void> {
    // get token form local storage
    return Promise.resolve();
  }

  parseJwt(token: string) {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    return JSON.parse(jsonPayload);
  }
}

export const authentication_manager: AuthenticationManager =
  new CustomEndpointManager();
