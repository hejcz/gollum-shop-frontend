<script lang="ts">
  import { Link } from "svelte-navigator";
  import { fetchCampaigns, unlockCampaign } from "../api/Api";
  import { role } from "../stores";
  import CampaignsNav from "./CampaignsNav.svelte";
  import Campaign from "./Campaign.svelte";

  let inactive_campaigns = fetchCampaigns(false);

  async function unlock(uuid: string) {
    await unlockCampaign(uuid);
    inactive_campaigns = fetchCampaigns(false);
  }
</script>

<h1>Campaigns archive</h1>

<CampaignsNav bind:campaigns={inactive_campaigns} />

<div class="row campaigns-row">
  {#await inactive_campaigns then campaigns}
    <div class="mb-2 mt-2">
      <div class="accordion" id="accordionExample">
        {#each campaigns as c}
          <Campaign campaign={c}>
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
          </Campaign>
        {/each}
      </div>
    </div>
  {/await}
</div>