import type { Auth0Client } from "@auth0/auth0-spa-js";
import { writable, Writable } from "svelte/store";

export interface Role {
  might_modify_campaign(): boolean;
}

class LoggedUser implements Role {
  might_modify_campaign(): boolean {
    return false;
  }
}

class Admin implements Role {
  might_modify_campaign(): boolean {
    return true;
  }
}

export function switchToLoggedUser() {
  role.update(() => new LoggedUser());
}

export function switchToAdmin() {
  role.update(() => new Admin());
}

export const user: Writable<string> = writable(null);

export const role: Writable<Role> = writable(new Admin() as Role);

export const auth0_client: Writable<Auth0Client> = writable(null);
