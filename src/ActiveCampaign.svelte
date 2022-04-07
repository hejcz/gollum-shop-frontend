<script lang="ts">
  import { Link } from "svelte-navigator";
  import { role } from "./stores";
  import type { Campaign } from "./api/Api";

  export let lock_function: () => void;

  export let campaign: Campaign;
  const uuid = campaign.uuid;
</script>

<div class="accordion-item">
  <h2 class="accordion-header" id="headingOne">
    <button
      class="accordion-button collapsed"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target={"#collapse" + campaign.uuid}
      aria-expanded="true"
      aria-controls={"collapse" + campaign.uuid}>
      {#if campaign.url == null}
        {campaign.title}
      {:else}
        <a href={campaign.url} target="_blank">{campaign.title}</a>
      {/if}
    </button>
  </h2>
  <div
    id={"collapse" + campaign.uuid}
    class="accordion-collapse collapse"
    aria-labelledby="headingOne"
    data-bs-parent="#accordionExample">
    <div class="accordion-body">
      <ul>
        <li>
          <Link to="/order/{uuid}">Order / Modify order</Link>
        </li>
        {#if $role.might_modify_campaign()}
          <li>
            <Link to="/edit/{uuid}">Edit campaign</Link>
          </li>
          <li>
            <Link to="/orders/{uuid}">Manage orders</Link>
          </li>
          <li>
            <span class="fake-link" on:click={lock_function}>
              Lock campaign
            </span>
          </li>
        {/if}
      </ul>
    </div>
  </div>
</div>

<style>
  ul {
    padding-left: 0rem;
    list-style-type: none;
  }
</style>
