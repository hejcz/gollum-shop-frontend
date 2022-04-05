<script lang="ts">
	import createAuth0Client from "@auth0/auth0-spa-js";
	import { onMount } from "svelte";
	import { Router, Route, useNavigate } from "svelte-navigator";
	import ActiveCampaigns from "./ActiveCampaigns.svelte";
	import EditCampaign from "./admin/EditCampaign.svelte";
	import Login from "./auth0/Login.svelte";
	import { store_credentials } from "./auth0/util";
	import ManageOrders from "./ManageOrders.svelte";
	import Navigation from "./Navigation.svelte";
	import Order from "./Order.svelte";
	import { auth0_client, role, user } from "./stores";

	onMount(async () => {
		const response = await fetch("/auth_config.json");
		const config = await response.json();

		console.log("mount app")

		$auth0_client = await createAuth0Client({
			domain: config.domain,
			client_id: config.clientId
		});

		await store_credentials();
	})
</script>

<svelte:head>
	<title>Zakupy u Golluma</title>
</svelte:head>
<Router>
	<div class="container">
		{#if $user == null}
			<Route path="/">
				<Login></Login>
			</Route>
		{:else}
			<Navigation></Navigation>
			<Route path="/">
				<ActiveCampaigns />
			</Route>
			<Route path="/order/:uuid" let:params>
				<Order uuid={params.uuid} />
			</Route>
			{#if $role.might_modify_campaign()}
				<Route path="/edit/:uuid" let:params>
					<EditCampaign uuid={params.uuid} />
				</Route>
				<Route path="/orders/:uuid" let:params>
					<ManageOrders uuid={params.uuid} />
				</Route>
			{/if}
		{/if}
	</div>
</Router>

<style>
	:global(.fake-link) {
		cursor: pointer;
		color: #0d6efd;
		text-decoration: underline;
	}

	:global(a:visited) {
		color: #0d6efd;
	}
</style>
