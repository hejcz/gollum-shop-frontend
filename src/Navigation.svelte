<script lang="ts">
	import { Link } from "svelte-navigator";
	import { auth0_client, switchToAdmin, switchToLoggedUser, user } from "./stores";

	async function logout() {
        await $auth0_client.logout({localOnly: true})
		$user = null
    }
</script>

<div class="nav">
	<span><Link to="/">Back to Active campaigns</Link></span>
	<span class="fake-link" on:click={switchToAdmin}>Switch to admin</span>
	<span class="fake-link" on:click={switchToLoggedUser}>Switch to user</span>
	<span class="fake-link" on:click={logout}>Logout</span>
</div>

<style>
	.nav > span {
		margin-right: 1em;
	}
</style>
