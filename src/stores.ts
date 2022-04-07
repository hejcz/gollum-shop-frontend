import type { Auth0Client } from "@auth0/auth0-spa-js";
import { writable, Writable } from "svelte/store";
import { Anonymous, Role, LoggedUser, Admin } from "./auth0/roles";

export const user: Writable<string> = writable(null);

export const role: Writable<Role> = writable(new Anonymous());

export const auth0_client: Writable<Auth0Client> = writable(null);

export function switchToLoggedUser() {
  role.set(new LoggedUser());
}

export function switchToAdmin() {
  role.set(new Admin());
}
