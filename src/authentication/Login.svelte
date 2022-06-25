<script lang="ts">
  import { authentication_manager } from "./authentication_manager";
  import { _ } from "svelte-i18n";
  import { get } from "svelte/store";
  import { onMount } from "svelte";

  let username: string = "";
  let email: string = "";
  let password: string = "";
  let repeated_password: string = "";
  let signup_mode: boolean = false;

  let warning = null;
  let successful_signup = false;

  async function login() {
    warning = null;
    await authentication_manager.login(email, password);
  }

  async function signup() {
    warning = null;
    if (password !== repeated_password) {
      warning = get(_)("login.different_password");
      return;
    }
    const success = await authentication_manager.signup(
      username,
      password,
      email
    );
    if (success) {
      successful_signup = true;
    } else {
      warning = get(_)("login.signup_error");
    }
  }

  async function switch_mode() {
    warning = null;
    username = "";
    email = "";
    password = "";
    repeated_password = "";
    signup_mode = !signup_mode;
  }

  onMount(async () => {
    const cookie = document.cookie;
    const access_token = cookie.split("=")[1];
    if (access_token) {
      await authentication_manager.test_credentials(access_token);
    }
  });
</script>

{#if successful_signup}
  <h1>{$_("login.signup_success")}</h1>
{:else if signup_mode}
  <h1>{$_("login.signup")}</h1>
  <div class="centered mt-4">
    <div class="stacked">
      <form>
        <div class="mb-3">
          <label for="username" class="form-label">
            {$_("login.username")}
          </label>
          <input
            bind:value={username}
            type="email"
            class="form-control"
            id="username" />
        </div>
        <div class="mb-3">
          <label for="email" class="form-label">{$_("login.email")}</label>
          <input
            bind:value={email}
            type="email"
            class="form-control"
            id="email" />
        </div>
        <div class="mb-3">
          <label for="password1" class="form-label">
            {$_("login.password")}
          </label>
          <input
            bind:value={password}
            type="password"
            class="form-control"
            id="password1" />
        </div>
        <div class="mb-3">
          <label for="password2" class="form-label">
            {$_("login.repeat_password")}
          </label>
          <input
            bind:value={repeated_password}
            type="password"
            class="form-control"
            id="password2" />
        </div>
        <button type="button" on:click={signup} class="btn btn-primary">
          {$_("login.signup")}
        </button>
        <button type="button" on:click={switch_mode} class="btn btn-link">
          {$_("login.login")}
        </button>
      </form>
    </div>
  </div>
{:else}
  <h1>{$_("login.login")}</h1>
  <div class="centered mt-4">
    <div class="stacked">
      <form>
        <div class="mb-3">
          <label for="email" class="form-label">{$_("login.email")}</label>
          <input
            bind:value={email}
            type="email"
            class="form-control"
            id="email" />
        </div>
        <div class="mb-3">
          <label for="password1" class="form-label">
            {$_("login.password")}
          </label>
          <input
            bind:value={password}
            type="password"
            class="form-control"
            id="password1" />
        </div>
        <button type="button" on:click={login} class="btn btn-primary">
          {$_("login.submit")}
        </button>
        <button type="button" on:click={switch_mode} class="btn btn-link">
          {$_("login.signup")}
        </button>
      </form>
    </div>
  </div>
{/if}
{#if warning != null}
  <div class="alert alert-warning mt-4" role="alert">
    {warning}
  </div>
{/if}

<style>
  form {
    max-width: 500px;
  }

  .centered {
    display: flex;
    justify-content: center;
  }

  .stacked {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
</style>
