import type { Auth0Client } from "@auth0/auth0-spa-js";
import { writable, Writable } from "svelte/store";
import { Anonymous, Role } from "./auth0/util";

export const user: Writable<string> = writable(null);

export const role: Writable<Role> = writable(new Anonymous());

export const auth0_client: Writable<Auth0Client> = writable(null);
