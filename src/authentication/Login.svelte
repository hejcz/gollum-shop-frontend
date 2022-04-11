<script lang="ts">
  import { auth0_client_initialized } from "../stores";
  import { authentication_manager } from "./authentication_manager";
  import { _ } from "svelte-i18n";

  async function login() {
    await authentication_manager.login();
    await authentication_manager.store_credentials();
  }
</script>

{#if $auth0_client_initialized}
  <h1 on:click={login}>{$_("login.login")}</h1>
{:else}
  <h1>{$_("login.loading_client")}</h1>
  <div class="d-flex justify-content-center">
    <div class="spinner-border" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
{/if}

<style>
  h1 {
    cursor: pointer;
  }
</style>
