import type { Auth0Client } from "@auth0/auth0-spa-js";
import { derived, Readable, writable, Writable } from "svelte/store";
import { Anonymous, Role, LoggedUser, Admin } from "./authentication/roles";

export const user: Writable<string> = writable(null);

export const role: Writable<Role> = writable(new Anonymous());

export const auth0_client: Writable<Auth0Client> = writable(null);

export const auth0_client_initialized: Readable<boolean> = derived(
  auth0_client,
  (value, set) => {
    set(value !== null);
  }
);

export function switchToLoggedUser() {
  role.set(new LoggedUser());
}

export function switchToAdmin() {
  role.set(new Admin());
}
