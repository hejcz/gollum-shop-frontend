<script lang="ts">
	import { Router, Route, Link } from "svelte-navigator";
	import ActiveCampaigns from "./ActiveCampaigns.svelte";
	import EditCampaign from "./admin/EditCampaign.svelte";
import ManageOrders from "./ManageOrders.svelte";
	import Order from "./Order.svelte";
	import { role, switchToAdmin, switchToLoggedUser, user } from "./stores";
</script>

<svelte:head>
	<title>Zakupy u Golluma</title>
</svelte:head>
<Router>
	<div class="container">
		{#if $user != null}
		<div class="nav">
			<span><Link to="/">Back to Active campaigns</Link></span>
			<span class="fake-link" on:click={switchToAdmin}>Switch to admin</span>
			<span class="fake-link" on:click={switchToLoggedUser}>Switch to user</span>
		</div>
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
		{:else}
		Login first
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

	.nav > span {
		margin-right: 1em;
	}
</style>
