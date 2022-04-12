<script lang="ts">
  import { Link } from "svelte-navigator";
  import { authentication_manager } from "./authentication/authentication_manager";
  import { switchToLoggedUser, switchToAdmin } from "./stores";
  import { _ } from "svelte-i18n";

  export let hide_actions = false;
  export let logout_only = false;

  async function logout() {
    await authentication_manager.logout();
  }
</script>

<nav class="navbar navbar-expand-lg navbar-light bg-light">
  <div class="container-fluid">
    <span class="navbar-brand">{$_("nav.title")}</span>
    <button
      class="navbar-toggler"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#navbarNav"
      aria-controls="navbarNav"
      aria-expanded="false"
      aria-label="Toggle navigation">
      <span class="navbar-toggler-icon" />
    </button>
    {#if !hide_actions}
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
          {#if !logout_only}
            <li class="nav-item">
              <span class="nav-link">
                <Link to="/">{$_("nav.active_campaigns")}</Link>
              </span>
            </li>
            <li class="nav-item">
              <span class="nav-link">
                <Link to="/campaigns/archive">
                  {$_("nav.archived_campaigns")}
                </Link>
              </span>
            </li>
            <li class="nav-item">
              <span class="nav-link">
                <Link to="/campaigns/proposals">
                  {$_("nav.proposed_campaigns")}
                </Link>
              </span>
            </li>
            <li class="nav-item">
              <span class="nav-link">
                <Link to="/orders-history">{$_("nav.orders_history")}</Link>
              </span>
            </li>
            <li class="nav-item">
              <span class="nav-link" on:click={switchToAdmin}>
                {$_("nav.switch_to_admin")}
              </span>
            </li>
            <li class="nav-item">
              <span class="nav-link" on:click={switchToLoggedUser}>
                {$_("nav.switch_to_user")}
              </span>
            </li>
          {/if}
        </ul>
        <div class="logout navbar-nav">
          <span class="nav-link" on:click={logout}>{$_("nav.logout")}</span>
        </div>
      </div>
    {/if}
  </div>
</nav>
<div class="mt-3" />

<style>
  :global(.nav-link > a) {
    color: inherit !important;
    text-decoration: inherit !important;
  }

  .nav-link {
    cursor: pointer;
  }

  .logout {
    display: flex;
    flex-grow: 1;
    justify-content: flex-end;
  }
</style>
