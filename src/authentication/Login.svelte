<script lang="ts">
  import { authentication_manager } from "./authentication_manager";
  import { _ } from "svelte-i18n";
  import { get } from "svelte/store";
  import { onMount } from "svelte";
  import { useNavigate } from "svelte-navigator";

  const navigate = useNavigate();

  let email: string = "";
  let password: string = "";
  let warning = null;

  async function login() {
    warning = null;
    let result = await authentication_manager.login(email, password);
    if (!result) warning = get(_)("login.error");
  }

  onMount(async () => {
    const cookie = document.cookie;
    const access_token = cookie.split("=")[1];
    if (access_token) {
      await authentication_manager.test_credentials(access_token);
    }
  });
</script>

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
      <button
        type="button"
        on:click={() => navigate("/signup")}
        class="btn btn-link">
        {$_("login.signup")}
      </button>
    </form>
  </div>
</div>
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
