<script lang="ts">
  import { Link } from "svelte-navigator";
  import { fetchCampaigns, unlockCampaign } from "./api/Api";
  import ActiveCampaign from "./CampaignTab.svelte";
  import { role } from "./stores";
  import { debounce } from "./utils/debounce";

  let search: string = "";
  let inactive_campaigns = fetchCampaigns(false);

  async function unlock(uuid: string) {
    await unlockCampaign(uuid);
    inactive_campaigns = fetchCampaigns(false, search);
  }

  const filter = debounce(() => {
    inactive_campaigns = fetchCampaigns(false, search);
  }, 500);
</script>

<h1>Active campaigns</h1>

<input
  type="text"
  bind:value={search}
  on:keyup={filter}
  placeholder="Filter campaigns by title" />

<div class="row">
  {#await inactive_campaigns then campaigns}
    <div class="mb-2 mt-2">
      <div class="accordion" id="accordionExample">
        {#each campaigns as c}
          <ActiveCampaign campaign={c}>
            <slot id="actions">
              {#if $role.might_modify_campaign()}
                <ul>
                  <li>
                    <Link to="/edit/{c.uuid}">Edit campaign</Link>
                  </li>
                  <li>
                    <Link to="/orders/{c.uuid}">Manage orders</Link>
                  </li>
                  <li>
                    <span class="fake-link" on:click={() => unlock(c.uuid)}>
                      Unlock campaign
                    </span>
                  </li>
                </ul>
              {:else}
                Nothing to do here
              {/if}
            </slot>
          </ActiveCampaign>
        {/each}
      </div>
    </div>
  {/await}
</div>

<style>
  ul {
    padding-left: 0rem;
    list-style-type: none;
  }
</style>
