<script lang="ts">
  import { Campaign, fetchCampaigns } from "../api/Api";
  import { debounce } from "../utils/debounce";

  export let campaigns: Promise<Campaign[]>;
  let search: string = "";

  const filter = debounce(() => {
    campaigns = fetchCampaigns(true, search);
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
