import { readable, Readable, writable, Writable } from "svelte/store";
import { Admin, Anonymous, LoggedUser, Role } from "./authentication/roles";

export const user: Writable<string> = writable(null);

export const role: Writable<Role> = writable(new Anonymous());

export const access_token: Writable<string> = writable(null);

export const api_url: Readable<string> = readable(
  "https://bonestest.herokuapp.com/"
);

export function switchToLoggedUser() {
  role.set(new LoggedUser());
}

export function switchToAdmin() {
  role.set(new Admin());
}
