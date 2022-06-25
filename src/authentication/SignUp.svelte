<script lang="ts">
  import { authentication_manager } from "./authentication_manager";
  import { _ } from "svelte-i18n";
  import { get } from "svelte/store";
  import { useNavigate } from "svelte-navigator";

  const navigate = useNavigate();
  const whitespaces = /^\s*$/;

  let username: string = "";
  let email: string = "";
  let password: string = "";
  let repeated_password: string = "";
  let warning = null;
  let successful_signup = false;

  async function signup() {
    warning = null;
    if (!validate_form()) {
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

  function validate_form() {
    if (whitespaces.test(username)) {
      warning = get(_)("login.warn.username_must_not_be_empty");
      return false;
    }
    if (whitespaces.test(email)) {
      warning = get(_)("login.warn.email_must_not_be_empty");
      return false;
    }
    if (whitespaces.test(password)) {
      warning = get(_)("login.warn.password_must_not_be_empty");
      return false;
    }
    if (password !== repeated_password) {
      warning = get(_)("login.different_password");
      return false;
    }
    return true;
  }
</script>

{#if successful_signup}
  <h1>{$_("login.signup_success")}</h1>
{:else}
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
        <button
          type="button"
          on:click={() => navigate("/")}
          class="btn btn-link">
          {$_("login.login")}
        </button>
        {#if warning != null}
          <div class="alert alert-warning mt-4" role="alert">
            {warning}
          </div>
        {/if}
      </form>
    </div>
  </div>
{/if}

<style>
  form {
    max-width: 300px;
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
