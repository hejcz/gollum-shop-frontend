import { auth0_client, user } from "../stores";
import { get } from "svelte/store";

export const auth0_audience = { audience: "http://localhost:8090" };

export async function store_credentials() {
  const client = get(auth0_client);
  let user_info = await client.getUser({ ...auth0_audience });
  console.log(user_info);
  if (user_info != null) {
    user.set(user_info.nickname);
  }
}
