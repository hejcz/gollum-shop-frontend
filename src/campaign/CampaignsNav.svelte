<script lang="ts">
  import { Campaign, api, CampaignsSearchParams } from "../api/Api";
  import { debounce } from "../utils/debounce";

  export let campaigns: Promise<Campaign[]>;
  export let fetch_filter: CampaignsSearchParams = {};
  let search: string = "";

  const filter = debounce(async () => {
    campaigns = api.fetchCampaigns({ titleLike: search, ...fetch_filter });
  }, 500);
</script>

<div class="campaigns-controls">
  <input
    type="text"
    bind:value={search}
    on:keyup={filter}
    placeholder="Filter campaigns by title" />
  <slot id="actions" />
</div>

<style>
  .campaigns-controls {
    display: flex;
    justify-content: flex-start;
    gap: 0.5em;
  }
</style>
