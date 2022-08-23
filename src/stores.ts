import { readable, Readable, writable, Writable } from "svelte/store";
import { Admin, LoggedUser, Role } from "./authentication/roles";

export const role: Writable<Role> = writable(null);

export const user_uuid: Writable<string> = writable(null);

export const access_token: Writable<string> = writable(null);

export const api_url: Readable<string> = readable(
  "https://www.gollum.pl/api/",
  // "http://localhost:3000/api/"
);

export function switchToLoggedUser() {
  role.set(new LoggedUser());
}

export function switchToAdmin() {
  role.set(new Admin());
}
