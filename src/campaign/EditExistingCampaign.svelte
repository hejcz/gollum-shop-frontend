<script lang="ts">
  import { onMount } from "svelte";
  import { _ } from "svelte-i18n";
  import { useNavigate } from "svelte-navigator";
  import { v4 } from "uuid";
  import { api, Campaign, CampaignItem } from "../api/Api";
  import EditCampaign from "./EditCampaign.svelte";

  export let uuid: string;

  const navigate = useNavigate();

  if (uuid == null) {
    navigate("/");
  }

  let campaign: Campaign;
  let removable_items: CampaignItem[] = [];

  $: items = [...(campaign == null ? [] : campaign.items), ...removable_items];

  onMount(async () => {
    campaign = await api.fetchCampaign(uuid);
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
      is_new: false,
    });
    removable_items = [];
  }
</script>

{#if campaign == null}
  <h1>{$_("edit_campaign.loading")}</h1>
{:else}
  <EditCampaign
    {add_item}
    {save}
    {delete_item}
    {campaign}
    {items}
    title={$_("edit_campaign.title_edit", {
      values: { title: campaign.title },
    })} />
{/if}
