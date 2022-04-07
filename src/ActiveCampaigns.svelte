<script lang="ts">
  import { Link, useNavigate } from "svelte-navigator";
  import { v4 as uuidv4 } from "uuid";
  import { fetchCampaigns, lockCampaign } from "./api/Api";
  import { debounce } from "./utils/debounce";
  import ActiveCampaign from "./CampaignTab.svelte";
  import { role } from "./stores";

  let search: string = "";
  let active_campaigns = fetchCampaigns(true);
  const navigate = useNavigate();

  function add_new_campaign() {
    navigate(`/edit/${uuidv4()}`);
  }

  async function lock(uuid: string) {
    await lockCampaign(uuid);
    active_campaigns = fetchCampaigns(true, search);
  }

  const filter = debounce(() => {
    active_campaigns = fetchCampaigns(true, search);
  }, 500);
</script>

<h1>Active campaigns</h1>

{#if $role.might_modify_campaign()}
  <div class="mb-2">
    <button type="button" class="btn btn-primary" on:click={add_new_campaign}>
      + Add campaign
    </button>
  </div>
{/if}

<input
  type="text"
  bind:value={search}
  on:keyup={filter}
  placeholder="Filter campaigns by title" />

<div class="row">
  {#await active_campaigns then campaigns}
    <div class="mb-2 mt-2">
      <div class="accordion" id="accordionExample">
        {#each campaigns as c}
          <ActiveCampaign campaign={c}>
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
    margin-bottom: 0px;
  }
</style>
