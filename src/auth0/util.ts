import { auth0_client, user } from '../stores';
import { get } from 'svelte/store';

export async function store_credentials() {
    const client = get(auth0_client);
    let user_info = await client.getUser({audience: "http://localhost:8090"})
    if (user_info != null) {
        user.set(user_info.nickname)
    }
}