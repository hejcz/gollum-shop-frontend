<script lang="ts">
  import { _ } from "svelte-i18n";
  import type { Campaign, CampaignItem } from "../api/Api";
  import InProgressButton from "../utils/InProgressButton.svelte";

  export let title: string;
  export let add_item: () => void;
  export let delete_item: (item_uuid: string) => void;
  export let save: () => Promise<void>;
  export let items: CampaignItem[];
  export let campaign: Campaign;

  let save_in_progress: boolean = false;

  async function save_with_progress() {
    save_in_progress = true;
    await save();
    save_in_progress = false;
  }
</script>

<h1>
  {title}
</h1>

<div class="mb-2">
  <button
    type="button"
    class="btn btn-primary"
    on:click={add_item}
    disabled={save_in_progress}>
    + {$_("edit_campaign.add_item")}
  </button>
  <InProgressButton
    on_click_function={save_with_progress}
    label={$_("edit_campaign.save")}
    bind:in_progress={save_in_progress} />
</div>
<div class="mb-3">
  <label for="title" class="form-label">
    {$_("edit_campaign.campaign_title")}
  </label>
  <input
    class="form-control"
    type="text"
    id="title"
    bind:value={campaign.title}
    disabled={save_in_progress} />
</div>
<div class="mb-3">
  <label class="form-label" for="campaign_url">
    {$_("edit_campaign.campaign_url")}
  </label>
  <input
    class="form-control"
    type="text"
    id="campaign_url"
    bind:value={campaign.url}
    disabled={save_in_progress} />
</div>
<div class="mb-3">
  <label class="form-label" for="campaign_url">
    {$_("edit_campaign.image_url")}
  </label>
  <input
    class="form-control"
    type="text"
    id="campaign_img_url"
    bind:value={campaign.img_url}
    disabled={save_in_progress} />
</div>
{#each [...items] as item, index}
  <div class="card mb-2" style="width: 100%;">
    <div class="card-body">
      <div class="input-group">
        <span class="input-group-text">{item.ordinal}.</span>
        <span class="input-group-text" for="item_name_{item.uuid}">
          {$_("edit_campaign.item_name")}
        </span>
        <input
          class="form-control"
          type="text"
          id="item_name_{item.uuid}"
          bind:value={item.name}
          disabled={save_in_progress} />
      </div>
      <div class="input-group">
        <span class="input-group-text" for="item_price_{item.uuid}">
          {$_("edit_campaign.item_price")}
        </span>
        <input
          class="form-control"
          type="number"
          min="0"
          id="item_price_{item.uuid}"
          bind:value={item.price}
          disabled={save_in_progress} />
      </div>
      <button
        type="button"
        class="btn btn-danger"
        on:click={() => delete_item(item.uuid)}
        disabled={index < campaign.items.length}>
        {$_("edit_campaign.delete_item")}
      </button>
    </div>
  </div>
{/each}

<style>
  .card-body {
    align-items: flex-start;
    flex-direction: row;
    flex-wrap: wrap;
    display: flex;
    gap: 1rem;
  }

  .input-group {
    width: 100%;
  }

  @media (min-width: 992px) {
    .input-group {
      width: auto;
      flex-grow: 1;
    }
  }
</style>
