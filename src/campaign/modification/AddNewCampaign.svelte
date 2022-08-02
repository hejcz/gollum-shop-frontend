<script lang="ts">
  import { onMount } from "svelte";
  import { _ } from "svelte-i18n";
  import { useNavigate } from "svelte-navigator";
  import { v4 } from "uuid";
  import { api, Campaign, CampaignItem, CampaignStatus } from "../../api/Api";
  import EditCampaign from "./EditCampaign.svelte";

  const navigate = useNavigate();

  const newCampaign: () => Campaign = () => ({
    uuid: v4(),
    items: [],
    locked: false,
    title: "",
    img_url: "",
    url: "",
    status: CampaignStatus.ACTIVE,
  });

  let campaign: Campaign;
  let items: CampaignItem[] = [];

  onMount(async () => {
    campaign = newCampaign();
  });

  function delete_item(item_uuid: string) {
    items = items
      .filter((it) => it.uuid !== item_uuid)
      .map((it, index) => ({ ...it, ordinal: index + 1 }));
  }

  function add_item() {
    items.push({
      name: "",
      price: 0,
      uuid: v4(),
      ordinal: campaign.items.length + items.length + 1,
    });
    items = items;
  }

  async function save() {
    items.forEach((it) => (it.uuid = null));
    const campaign_with_extra_items: Campaign = {
      ...campaign,
      items: [...items],
    };
    campaign = await api.updateCampaign({
      campaign: campaign_with_extra_items,
      is_new: true,
    });
    items = [];
    navigate(`/campaigns/edit/${campaign.uuid}`);
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
    title={$_("edit_campaign.title_add", {
      values: { title: campaign.title },
    })} />
{/if}
