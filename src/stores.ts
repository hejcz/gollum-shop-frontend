import type { Auth0Client } from "@auth0/auth0-spa-js";
import { readable, Readable, writable, Writable } from "svelte/store";
import { Admin, Anonymous, LoggedUser, Role } from "./authentication/roles";

export const user: Writable<string> = writable(null);

export const role: Writable<Role> = writable(new Anonymous());

export const auth0_client: Writable<Auth0Client> = writable(null);

export const access_token: Writable<string> = writable(null);

export const api_url: Readable<string> = readable("https://bonestest.herokuapp.com/");

export const authentication_client_initialized: Writable<boolean> = writable(false);

export function switchToLoggedUser() {
  role.set(new LoggedUser());
}

export function switchToAdmin() {
  role.set(new Admin());
}
