<script lang="ts">
  import { authentication_manager } from "./authentication_manager";

  async function login() {
    await authentication_manager.login();
    await authentication_manager.store_credentials();
  }
</script>

{#if authentication_manager.is_client_initialized()}
  <h1 on:click={login}>Click to login</h1>
{:else}
  <h1>Authorization in progress</h1>
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
