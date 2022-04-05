<script lang="ts">
  import { auth0_client } from "../stores";
  import { store_credentials } from "./util";

  async function login() {
    await $auth0_client.loginWithPopup({
      audience: "http://localhost:8090",
      connection: "Username-Password-Authentication",
    });
    await store_credentials();
  }
</script>

{#if $auth0_client == null}
  <h1>Authorization in progress</h1>
{:else}
  <h1>Login</h1>
  <button id="btn-login" on:click={login}>Log in</button>
{/if}
