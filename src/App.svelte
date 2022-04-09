<script lang="ts">
  import { onMount } from "svelte";
  import { Route, Router } from "svelte-navigator";
  import Anonymous from "./Anonymous.svelte";
  import { authentication_manager } from "./authentication/authentication_manager";
  import Login from "./authentication/Login.svelte";
  import ActiveCampaigns from "./campaign/ActiveCampaigns.svelte";
  import CampaignsCandidates from "./campaign/CampaignsCandidates.svelte";
  import EditCampaign from "./campaign/EditCampaign.svelte";
  import InactiveCampaigns from "./campaign/InactiveCampaigns.svelte";
  import Navigation from "./Navigation.svelte";
  import ManageOrders from "./order/ManageOrders.svelte";
  import Order from "./order/Order.svelte";
  import OrdersHistory from "./order/OrdersHistory.svelte";
  import { role, user } from "./stores";

  onMount(async () => {
    await authentication_manager.initiate_client();
    await authentication_manager.store_credentials();
  });
</script>

<svelte:head>
  <title>Gollum Shop</title>
</svelte:head>
<Router>
  <div class="container">
    {#if $user == null}
      <Navigation hide_actions={true} />
      <Login />
    {:else if $role.is_anonymous()}
      <Navigation logout_only={true} />
      <Anonymous />
    {:else}
      <Navigation />
      <Route path="/">
        <ActiveCampaigns />
      </Route>
      <Route path="/campaigns/archive">
        <InactiveCampaigns />
      </Route>
      <Route path="/order/:uuid" let:params>
        <Order uuid={params.uuid} />
      </Route>
      <Route path="/orders-history" let:params>
        <OrdersHistory />
      </Route>
      <Route path="/campaigns/proposals" let:params>
        <CampaignsCandidates />
      </Route>
      {#if $role.might_modify_campaign()}
        <Route path="/campaigns/edit" let:params let:location>
          <EditCampaign uuid={null} location={location.search} />
        </Route>
        <Route path="/campaigns/edit/:uuid" let:params>
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

  :global(h1) {
    text-align: center;
  }

  :global(.campaigns-row ul) {
    padding-left: 0rem;
    list-style-type: none;
    margin-bottom: 0px;
  }
</style>
