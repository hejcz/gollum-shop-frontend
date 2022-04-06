<script lang="ts">
  import { useNavigate } from "svelte-navigator";
  import { v4 as uuidv4 } from "uuid";
  import { fetchActiveCampaigns, lockCampaign } from "./api/Api";
  import { debounce } from "./utils/debounce";
  import ActiveCampaign from "./ActiveCampaign.svelte";
  import { role } from "./stores";

  let search: string = "";
  let active_campaigns = fetchActiveCampaigns();
  const navigate = useNavigate();

  function add_new_campaign() {
    navigate(`/edit/${uuidv4()}`);
  }

  async function lock(uuid: string) {
    await lockCampaign(uuid);
    active_campaigns = fetchActiveCampaigns(search);
  }

  const filter = debounce(() => {
    active_campaigns = fetchActiveCampaigns(search);
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
          <!-- Locking removes campaign from actives so it must be passed to children -->
          <ActiveCampaign campaign={c} lock_function={() => lock(c.uuid)} />
        {/each}
      </div>
    </div>
  {/await}
</div>
