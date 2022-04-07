<script lang="ts">
  import { PopupCancelledError } from "@auth0/auth0-spa-js";

  import { auth0_client } from "../stores";
  import { auth0_audience, store_credentials } from "./util";

  async function login() {
    try {
      await $auth0_client.loginWithPopup({
        connection: "Username-Password-Authentication",
        ...auth0_audience,
      });
    } catch (error) {
      if (error instanceof PopupCancelledError) {
        // ignore
        return;
      }
    }
    await store_credentials();
  }
</script>

{#if $auth0_client == null}
  <h1>Authorization in progress</h1>
  <div class="d-flex justify-content-center">
    <div class="spinner-border" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
{:else}
  <h1 on:click={login}>Click to login</h1>
{/if}

<style>
  h1 {
    cursor: pointer;
  }
</style>
