import { auth0_client, user, role } from "../stores";
import { get } from "svelte/store";
import { Admin, Anonymous, LoggedUser } from "./roles";

const audience = "AUTH0_AUDIENCE";

export const auth0_audience = { audience: audience };
export const roles_key = "https://localhost:8090/roles";

export async function store_credentials() {
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
}
