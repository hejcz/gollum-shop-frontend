<script lang="ts">
  import { onMount } from "svelte";
  import { _ } from "svelte-i18n";
  import { Route, Router } from "svelte-navigator";
  import Anonymous from "./Anonymous.svelte";
  import { authentication_manager } from "./authentication/authentication_manager";
  import Login from "./authentication/Login.svelte";
  import ManageUsers from "./authentication/ManageUsers.svelte";
  import UserProfile from "./authentication/UserProfile.svelte";
  import SignUp from "./authentication/SignUp.svelte";
  import AddNewCampaign from "./campaign/modification/AddNewCampaign.svelte";
  import CampaignsCandidates from "./campaign/listing/CampaignsCandidates.svelte";
  import ChangeDraftToCampaign from "./campaign/modification/ChangeDraftToCampaign.svelte";
  import EditExistingCampaign from "./campaign/modification/EditExistingCampaign.svelte";
  import InactiveCampaigns from "./campaign/listing/InactiveCampaigns.svelte";
  import ActiveCampaigns from "./campaign/listing/ActiveCampaigns.svelte";
  import AddDraft from "./campaign/modification/AddDraft.svelte";
  import Navigation from "./Navigation.svelte";
  import ManageOrders from "./order/ManageOrders.svelte";
  import Order from "./order/Order.svelte";
  import OrdersHistory from "./order/OrdersHistory.svelte";
  import { role } from "./stores";
  import ClosedCampaigns from "./campaign/listing/ClosedCampaigns.svelte";

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
      <Route path="/campaigns/closed">
        <ClosedCampaigns />
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
      <Route path="/users/profile">
          <UserProfile />
        </Route>
      
      {#if $role.is_admin()}
        <Route path="/campaigns/add">
          <AddNewCampaign />
        </Route>
        <Route path="/campaigns/add/:uuid" let:params>
          <ChangeDraftToCampaign candidate_uuid={params.uuid} />
        </Route>
        <Route path="/campaigns/edit/:uuid" let:params>
          <EditExistingCampaign uuid={params.uuid} />
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
