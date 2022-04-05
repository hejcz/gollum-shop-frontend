<script lang="ts">
  import { v4 } from "uuid";
  import { fetchCampaign, updateCampaign, Campaign } from "../api/Api";

  export let uuid: string;

  const newCampaign: () => Campaign = () => ({
    uuid: uuid,
    items: [],
    locked: false,
    title: "",
  });

  let edited_campaign: Campaign;
  const campaign = fetchCampaign(uuid)
    .then(
      (campaign) => ({ ...campaign }),
      () => newCampaign()
    )
    .then((campaign) => (edited_campaign = campaign));

  function delete_item(item_uuid: string) {
    edited_campaign.items = edited_campaign.items.filter(
      (it) => it.uuid !== item_uuid
    );
  }

  function add_item() {
    edited_campaign.items.push({ name: "", price: 0, uuid: v4() });
    edited_campaign.items = edited_campaign.items;
  }

  async function save() {
    edited_campaign = await updateCampaign(edited_campaign);
  }
</script>

{#await campaign}
  <h1>Loading campaign {uuid}</h1>
{:then fetched_campaign}
  <h1>Edit campaign {fetched_campaign.title}</h1>

  <div class="mb-2">
    <button type="button" class="btn btn-primary" on:click={add_item}>
      + Add item
    </button>
    <button type="button" class="btn btn-primary" on:click={save}>Save</button>
  </div>
  <div class="input-group mb-3">
    <span class="input-group-text" for="title">Title</span>
    <input
      class="form-control"
      type="text"
      id="title"
      bind:value={edited_campaign.title} />
  </div>
  <div class="input-group mb-3">
    <span class="input-group-text" for="campaign_url">Campaign url</span>
    <input
      class="form-control"
      type="text"
      id="campaign_url"
      bind:value={edited_campaign.url} />
  </div>
  <div class="row align-items-end">
    {#each edited_campaign.items as item}
      <div class="col-12 col-lg-3">
        <span class="fake-link" on:click={() => delete_item(item.uuid)}>
          Delete
        </span>
        <div class="input-group mb-3">
          <span class="input-group-text" for="item_name_{item.uuid}">Name</span>
          <input
            class="form-control"
            type="text"
            id="item_name_{item.uuid}"
            bind:value={item.name} />
        </div>
        <div class="input-group mb-3">
          <span class="input-group-text" for="item_price_{item.uuid}">
            Price
          </span>
          <input
            class="form-control"
            type="number"
            min="0"
            id="item_price_{item.uuid}"
            bind:value={item.price} />
        </div>
      </div>
    {/each}
  </div>
{/await}
