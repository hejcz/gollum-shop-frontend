<script lang="ts">
  import { Link, useNavigate } from "svelte-navigator";
  import { v4 as uuidv4 } from "uuid";
  import { api } from "../api/Api";
  import { role } from "../stores";
  import CampaignsNav from "./CampaignsNav.svelte";
  import Campaign from "./Campaign.svelte";

  let active_campaigns = api.fetchCampaigns({});
  const navigate = useNavigate();

  function add_new_campaign() {
    navigate(`/edit/${uuidv4()}`);
  }

  async function lock(uuid: string) {
    await api.lockCampaign(uuid);
    active_campaigns = api.fetchCampaigns({});
  }
</script>

<h1>Active campaigns</h1>

<CampaignsNav bind:campaigns={active_campaigns}>
  <slot id="actions">
    {#if $role.might_modify_campaign()}
      <button type="button" class="btn btn-primary" on:click={add_new_campaign}>
        + Add campaign
      </button>
    {/if}
  </slot>
</CampaignsNav>

<div class="row campaigns-row">
  {#await active_campaigns then campaigns}
    <div class="mb-2 mt-2">
      <div class="accordion" id="accordionExample">
        {#each campaigns as c}
          <Campaign campaign={c}>
            <slot id="actions">
              <ul>
                <li>
                  <Link to="/order/{c.uuid}">Order / Modify order</Link>
                </li>
                {#if $role.might_modify_campaign()}
                  <li>
                    <Link to="/edit/{c.uuid}">Edit campaign</Link>
                  </li>
                  <li>
                    <Link to="/orders/{c.uuid}">Manage orders</Link>
                  </li>
                  <li>
                    <span class="fake-link" on:click={() => lock(c.uuid)}>
                      Lock campaign
                    </span>
                  </li>
                {/if}
              </ul>
            </slot>
          </Campaign>
        {/each}
      </div>
    </div>
  {/await}
</div>
