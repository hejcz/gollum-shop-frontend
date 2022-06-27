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
  import { role } from "./stores";
  import { _ } from "svelte-i18n";
  import ManageUsers from "./authentication/ManageUsers.svelte";
  import AddDraft from "./campaign/AddDraft.svelte";
  import SignUp from "./authentication/SignUp.svelte";

  onMount(async () => {
    await authentication_manager.store_credentials_if_authenticated();
  });
</script>

<svelte:head>
  <title>{$_("nav.title")}</title>
</svelte:head>
<Router>
  <div class="container">
    {#if $role == null}
      <Navigation hide_actions={true} />
      <Route path="/signup">
        <SignUp />
      </Route>
      <Route path="/*">
        <Login />
      </Route>
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
      <Route path="/orders-history">
        <OrdersHistory />
      </Route>
      <Route path="/drafts">
        <CampaignsCandidates />
      </Route>
      <Route path="/new-draft">
        <AddDraft />
      </Route>
      {#if $role.is_admin()}
        <Route path="/campaigns/edit" let:location>
          <EditCampaign uuid={null} location={location.search} />
        </Route>
        <Route path="/campaigns/edit/:uuid" let:params>
          <EditCampaign uuid={params.uuid} />
        </Route>
        <Route path="/orders/:uuid" let:params>
          <ManageOrders uuid={params.uuid} />
        </Route>
        <Route path="/users">
          <ManageUsers />
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
