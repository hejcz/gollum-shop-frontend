<script lang="ts">
  import { v4 } from "uuid";
  import { parse as parse_query_string } from "query-string";
  import { api, Campaign } from "../api/Api";
  import InProgressButton from "../utils/InProgressButton.svelte";
  import { useNavigate } from "svelte-navigator";
import { onMount } from "svelte";

  export let uuid: string;
  export let location: string = null;

  const navigate = useNavigate()

  const ADD = 0;
  const EDIT = 1;
  const ADD_FROM_CANDIDATE = 2;
  const mode = uuid != null 
    ? EDIT 
    : location == null || location.length === 0
      ? ADD
      : ADD_FROM_CANDIDATE;

  let candidate_uuid = null
  if (mode == ADD_FROM_CANDIDATE) {
    const parsed = parse_query_string(location)
    const from_value = parsed.from
    if (from_value != null) {
      if (Array.isArray(from_value)) {
        if (from_value.length > 0) {
          candidate_uuid = from_value[0]
        }
      } else {
        candidate_uuid = from_value
      }
    }
    if (candidate_uuid == null) {
      navigate("/")
    }
  }

  let save_in_progress = false;

  const newCampaign: () => Campaign = () => ({
    uuid: v4(),
    items: [],
    locked: false,
    title: "",
    img_url: "",
    url: ""
  });

  let campaign: Campaign;

  onMount(async () => {
    switch (mode) {
      case ADD:
        campaign = newCampaign()
        break;
      case ADD_FROM_CANDIDATE:
        const candidate = await api.fetchCampaignCandidate(candidate_uuid)
        campaign = {...newCampaign(), ...candidate, uuid: v4()}
        break;
      case EDIT:
        campaign = await api.fetchCampaign(uuid)
        break;
      default:
        throw new Error("unknown campaign modification mode: " + mode)
    }
  })

  function delete_item(item_uuid: string) {
    campaign.items = campaign.items.filter(
      (it) => it.uuid !== item_uuid
    );
  }

  function add_item() {
    campaign.items.push({ name: "", price: 0, uuid: v4() });
    campaign.items = campaign.items;
  }

  async function save() {
    campaign = await api.updateCampaign({campaign, candidate_uuid});
  }
</script>

{#if campaign == null}
  <h1>Loading campaign {uuid}</h1>
{:else}
  <h1>{mode == EDIT ? 'Edit' : 'Create'} campaign {campaign.title}</h1>

  <div class="mb-2">
    <button
      type="button"
      class="btn btn-primary"
      on:click={add_item}
      disabled={save_in_progress}>
      + Add item
    </button>
    <InProgressButton
      on_click_function={save}
      label="Save"
      bind:in_progress={save_in_progress} />
  </div>
  <div class="input-group mb-3">
    <span class="input-group-text" for="title">Title</span>
    <input
      class="form-control"
      type="text"
      id="title"
      bind:value={campaign.title}
      disabled={save_in_progress} />
  </div>
  <div class="input-group mb-3">
    <span class="input-group-text" for="campaign_url">Campaign url</span>
    <input
      class="form-control"
      type="text"
      id="campaign_url"
      bind:value={campaign.url}
      disabled={save_in_progress} />
  </div>
  <div class="input-group mb-3">
    <span class="input-group-text" for="campaign_url">Image url</span>
    <input
      class="form-control"
      type="text"
      id="campaign_img_url"
      bind:value={campaign.img_url}
      disabled={save_in_progress} />
  </div>
  {#each campaign.items as item}
    <div class="card mb-2" style="width: 100%;">
      <div class="card-body">
        <div class="input-group">
          <span class="input-group-text" for="item_name_{item.uuid}">Name</span>
          <input
            class="form-control"
            type="text"
            id="item_name_{item.uuid}"
            bind:value={item.name}
            disabled={save_in_progress} />
        </div>
        <div class="input-group">
          <span class="input-group-text" for="item_price_{item.uuid}">
            Price
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
          on:click={() => delete_item(item.uuid)}>
          Delete
        </button>
      </div>
    </div>
  {/each}
{/if}

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
