<script lang="ts">
  import { v4 } from "uuid";
  import { parse as parse_query_string } from "query-string";
  import { api, Campaign, CampaignItem } from "../api/Api";
  import InProgressButton from "../utils/InProgressButton.svelte";
  import { useNavigate } from "svelte-navigator";
  import { onMount } from "svelte";
  import { _ } from "svelte-i18n";

  export let uuid: string;
  export let location: string = null;

  const navigate = useNavigate();

  const ADD = 0;
  const EDIT = 1;
  const ADD_FROM_CANDIDATE = 2;
  let mode =
    uuid != null
      ? EDIT
      : location == null || location.length === 0
      ? ADD
      : ADD_FROM_CANDIDATE;

  let candidate_uuid = null;
  if (mode == ADD_FROM_CANDIDATE) {
    const parsed = parse_query_string(location);
    const from_value = parsed.from;
    if (from_value != null) {
      if (Array.isArray(from_value)) {
        if (from_value.length > 0) {
          candidate_uuid = from_value[0];
        }
      } else {
        candidate_uuid = from_value;
      }
    }
    if (candidate_uuid == null) {
      navigate("/");
    }
  }

  let save_in_progress = false;

  const newCampaign: () => Campaign = () => ({
    uuid: v4(),
    items: [],
    locked: false,
    title: "",
    img_url: "",
    url: "",
  });

  let campaign: Campaign;
  let removable_items: CampaignItem[] = [];

  onMount(async () => {
    switch (mode) {
      case ADD:
        campaign = newCampaign();
        break;
      case ADD_FROM_CANDIDATE:
        const candidate = await api.fetchCampaignCandidate(candidate_uuid);
        campaign = { ...newCampaign(), ...candidate, uuid: v4() };
        break;
      case EDIT:
        campaign = await api.fetchCampaign(uuid);
        break;
      default:
        throw new Error("unknown campaign modification mode: " + mode);
    }
  });

  function delete_item(item_uuid: string) {
    removable_items = removable_items
      .filter((it) => it.uuid !== item_uuid)
      .map((it, index) => ({ ...it, ordinal: index + 1 }));
  }

  function add_item() {
    removable_items.push({
      name: "",
      price: 0,
      uuid: v4(),
      ordinal: campaign.items.length + removable_items.length + 1,
    });
    removable_items = removable_items;
  }

  async function save() {
    removable_items.forEach((it) => (it.uuid = null));
    const campaign_with_extra_items: Campaign = {
      ...campaign,
      items: [...campaign.items, ...removable_items],
    };
    campaign = await api.updateCampaign({
      campaign: campaign_with_extra_items,
      candidate_uuid,
      is_new: mode === ADD || mode === ADD_FROM_CANDIDATE,
    });
    removable_items = [];
    mode = EDIT;
  }
</script>

{#if campaign == null}
  <h1>{$_("edit_campaign.loading")}</h1>
{:else}
  <h1>
    {mode == EDIT
      ? $_("edit_campaign.title_edit", { values: { title: campaign.title } })
      : $_("edit_campaign.title_add", { values: { title: campaign.title } })}
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
      on_click_function={save}
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
  {#each [...campaign.items, ...removable_items] as item, index}
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
