import { get } from "svelte/store";
import {
  access_token,
  access_token as acess_token_store,
  api_url,
  role as role_store,
  user_uuid,
} from "../stores";
import { Admin, Anonymous, LoggedUser } from "./roles";

export interface AuthenticationManager {
  login(login: string, password: string): Promise<boolean>;
  test_credentials(token: string): Promise<boolean>;
  logout(): Promise<void>;
  store_credentials_if_authenticated(): Promise<void>;
  signup(username: string, password: string, email: string): Promise<boolean>;
}

class LocalDevManager implements AuthenticationManager {
  test_credentials(token: string): Promise<boolean> {
    return Promise.resolve(true);
  }

  signup(
    _username: string,
    _password: string,
    _email: string
  ): Promise<boolean> {
    console.log("singnup unavailable for a LocalDevManager");
    return Promise.resolve(true);
  }

  login(_login: string, _password: string): Promise<boolean> {
    return Promise.resolve(true);
  }

  logout(): Promise<void> {
    role_store.set(null);
    return Promise.resolve();
  }

  store_credentials_if_authenticated(): Promise<void> {
    role_store.set(new Admin());
    return Promise.resolve();
  }
}

// https://stackoverflow.com/questions/179355/clearing-all-cookies-with-javascript
function clearCookies() {
  var cookies = document.cookie.split(";");

  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i];
    var eqPos = cookie.indexOf("=");
    var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }
}

function parseJwt(token: string) {
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

function setup_authorization_stores(access_token) {
  acess_token_store.set(access_token);
  const { role, uuid } = parseJwt(access_token);
  switch (role) {
    case "admin":
      role_store.set(new Admin());
      break;
    case "user":
      role_store.set(new LoggedUser());
      break;
    case "anonymous":
      role_store.set(new Anonymous());
      break;
  }
  user_uuid.set(uuid);
}

class CustomEndpointManager implements AuthenticationManager {
  api_url: string;

  constructor() {
    this.api_url = get(api_url);
  }

  test_credentials(token: string): Promise<boolean> {
    return (async () => {
      const response = await fetch(this.api_url + "auth/test", {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      if (response.ok) {
        setup_authorization_stores(token);
      }
      return response.ok;
    })();
  }

  signup(username: string, password: string, email: string): Promise<boolean> {
    return (async () => {
      const response = await fetch(this.api_url + "users", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ email, password, username }),
      });
      if (response.ok) {
        const { message } = await response.json();
        if (message === "user added, confirm your existence") {
          await this.login(email, password);
          return true;
        } else {
          console.log(message);
        }
      } else {
        const { message } = await response.json();
        console.log(message);
      }
      return false;
    })();
  }

  login(login: string, password: string): Promise<boolean> {
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
        if (access_token) {
          setup_authorization_stores(access_token);
          document.cookie = `gollum_token=${access_token};secure;SameSite=Strict;path=/`;
          return true;
        } else {
          console.log("No access token:", message);
          return false
        }
      } else {
        const { message } = await response.json();
        console.log("Login unsuccessfull:", message);
        return false
      }
    })();
  }

  logout(): Promise<void> {
    return (async () => {
      role_store.set(null);
      acess_token_store.set(null);
      clearCookies();
    })();
  }

  store_credentials_if_authenticated(): Promise<void> {
    // get token form local storage
    return Promise.resolve();
  }
}

export const authentication_manager: AuthenticationManager =
  new CustomEndpointManager();
