<script lang="ts">
  import { Link } from "svelte-navigator";
  import { authentication_manager } from "./authentication/authentication_manager";
  import { switchToLoggedUser, switchToAdmin } from "./stores";

  export let hide_actions = false;
  export let logout_only = false;

  async function logout() {
    await authentication_manager.logout();
  }
</script>

<nav class="navbar navbar-expand-lg navbar-light bg-light">
  <div class="container-fluid">
    <span class="navbar-brand">Gollum Shop</span>
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
          <li class="nav-item">
            <span class="nav-link" on:click={logout}>Logout</span>
          </li>
          {#if !logout_only}
            <li class="nav-item">
              <span class="nav-link"><Link to="/">Active campaigns</Link></span>
            </li>
            <li class="nav-item">
              <span class="nav-link">
                <Link to="/campaigns-archive">Campaigns archive</Link>
              </span>
            </li>
            <li class="nav-item">
              <span class="nav-link">
                <Link to="/orders-history">Orders history</Link>
              </span>
            </li>
            <li class="nav-item">
              <span class="nav-link" on:click={switchToAdmin}>
                Switch to admin
              </span>
            </li>
            <li class="nav-item">
              <span class="nav-link" on:click={switchToLoggedUser}>
                Switch to user
              </span>
            </li>
          {/if}
        </ul>
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
</style>
