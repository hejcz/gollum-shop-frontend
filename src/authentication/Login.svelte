<script lang="ts">
  import { authentication_client_initialized } from "../stores";
  import { authentication_manager } from "./authentication_manager";
  import { _ } from "svelte-i18n";

  let email: string = ''
  let password: string = ''

  async function login() {
    await authentication_manager.login(email, password);
    await authentication_manager.store_credentials();
  }
</script>

{#if $authentication_client_initialized}
  <h1>{$_("login.login")}</h1>
  <div style="display: flex; justify-content: center;" class="mt-4">
    <form>
      <div class="mb-3">
        <label for="exampleInputEmail1" class="form-label">{$_('login.email')}</label>
        <input bind:value={email} type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp">
      </div>
      <div class="mb-3">
        <label for="exampleInputPassword1" class="form-label">{$_('login.password')}</label>
        <input bind:value={password} type="password" class="form-control" id="exampleInputPassword1">
      </div>
      <button type="button" on:click={login} class="btn btn-primary">{$_('login.submit')}</button>
    </form>
  </div>
{:else}
  <h1>{$_("login.loading_client")}</h1>
  <div class="d-flex justify-content-center">
    <div class="spinner-border" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
{/if}

<style>
  form {
    max-width: 500px;
  }
</style>
