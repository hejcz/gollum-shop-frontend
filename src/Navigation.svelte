<script lang="ts">
  import { Link } from "svelte-navigator";
  import { auth0_client, role, user } from "./stores";
  import { Anonymous, switchToAdmin, switchToLoggedUser } from "./auth0/util";

  async function logout() {
    // localOnly option fools auth0 client but when we try to login then
    // there is no option to specify login/password
    await $auth0_client.logout();
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
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav">
        <li class="nav-item">
          <span class="nav-link"><Link to="/">Active campaigns</Link></span>
        </li>
        <li class="nav-item">
          <span class="nav-link" on:click={logout}>Logout</span>
        </li>
        <li class="nav-item">
          <span class="nav-link" on:click={switchToAdmin}>Switch to admin</span>
        </li>
        <li class="nav-item">
          <span class="nav-link" on:click={switchToLoggedUser}>
            Switch to user
          </span>
        </li>
      </ul>
    </div>
  </div>
</nav>
<div class="mt-3">
</div>

<style>
  :global(.nav-link > a) {
    color: inherit !important;
    text-decoration: inherit !important;
  }

  .nav-link {
    cursor: pointer;
  }
</style>
