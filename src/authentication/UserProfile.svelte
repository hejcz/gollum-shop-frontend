<script lang="ts">
  import { authentication_manager } from "./authentication_manager";
  import { onMount } from "svelte";
  import { _ } from "svelte-i18n";
  import { api, UserProfile } from "../api/Api";
  import { get } from "svelte/store";

  let user: UserProfile | null = null;
  let warning = null;
  let update_ok = false;

  onMount(async () => {
    user = await api.fetchUserProfile();
  });

  async function updateUserProfile() {
    warning = null;
    const success = await api.updateUserProfile(user);
    if (success) {
      update_ok = true;
    } else {
      warning = get(_)("update_profile.error");
    }
  }
</script>

<h1>{$_("nav.userprofile")} {user.username}</h1>

<form>
  <div class="mb-3">
    <label for="username" class="form-label">
      {$_("user_profile.username")}
    </label>
    <input
      bind:value={user.username}
      type="email"
      class="form-control"
      id="username" />
  </div>

  <div class="mb-3">
    <label for="firstname" class="form-label">
      {$_("user_profile.firstname")}
    </label>
    <input
      bind:value={user.firstname}
      type="email"
      class="form-control"
      id="firstname" />
  </div>

  <div class="mb-3">
    <label for="lastname" class="form-label">
      {$_("user_profile.lastname")}
    </label>
    <input
      bind:value={user.lastname}
      type="email"
      class="form-control"
      id="lastname" />
  </div>

  <div class="mb-3">
    <label for="email" class="form-label">
      {$_("user_profile.email")}
    </label>
    <input
      bind:value={user.email}
      type="email"
      class="form-control"
      id="email" />
  </div>

  <div class="mb-3">
    <label for="phone" class="form-label">
      {$_("user_profile.phone")}
    </label>
    <input
      bind:value={user.phone}
      type="email"
      class="form-control"
      id="phone" />
  </div>

  <div class="mb-3">
    <label for="street" class="form-label">
      {$_("user_profile.street")}
    </label>
    <input
      bind:value={user.street}
      type="email"
      class="form-control"
      id="street" />
  </div>
  <div class="mb-3">
    <label for="zip" class="form-label">
      {$_("user_profile.zip")}
    </label>
    <input bind:value={user.zip} type="email" class="form-control" id="zip" />
  </div>
  <div class="mb-3">
    <label for="city" class="form-label">
      {$_("user_profile.city")}
    </label>
    <input bind:value={user.city} type="email" class="form-control" id="city" />
  </div>
  <div class="mb-3">
    <label for="inpost" class="form-label">
      {$_("user_profile.inpost")}
    </label>
    <input
      bind:value={user.inpost_code}
      type="email"
      class="form-control"
      id="inpost" />
  </div>

  <button
    type="button"
    class="btn btn-success"
    on:click={() => updateUserProfile()}>
    {$_("user_profile.update")}
  </button>
</form>
