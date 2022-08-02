<script lang="ts">
  import { Link, useNavigate } from "svelte-navigator";
  import { api, Campaign, CampaignStatus } from "../../api/Api";
  import { role } from "../../stores";
  import AccordionList from "../../utils/AccordionList.svelte";
  import type { AccordionItem } from "../../utils/accordion_item";
  import { _ } from "svelte-i18n";

  const navigate = useNavigate();
  const fetch_filter = { status: CampaignStatus.CLOSED };

  let closed_campaigns = [];

  async function lock(uuid: string) {
    await api.changeStatus(uuid, CampaignStatus.ARCHIVED);
    closed_campaigns = await fetch(null);
  }

  async function unlock(uuid: string) {
    await api.changeStatus(uuid, CampaignStatus.ACTIVE);
    closed_campaigns = await fetch(null);
  }

  async function fetch(search: string): Promise<AccordionItem[]> {
    const campaigns: Campaign[] = await api.fetchCampaigns({
      titleLike: search,
      ...fetch_filter,
    });
    return campaigns.map(({ uuid, title, url, img_url }) => ({
      id: uuid,
      title,
      url,
      img_url,
    }));
  }
</script>

<h1>{$_("closed_campaigns.title")}</h1>

<AccordionList items_provider={fetch} items={closed_campaigns}>
  <svelte:fragment slot="item-actions" let:item>
    <ul>
      {#if $role.is_admin()}
        <ul>
          <li>
            <Link to="/campaigns/edit/{item.id}">
              {$_("closed_campaigns.edit_campaign")}
            </Link>
          </li>
          <li>
            <Link to="/orders/{item.id}">
              {$_("closed_campaigns.manage_orders")}
            </Link>
          </li>
          <li>
            <span class="fake-link" on:click={() => unlock(item.id)}>
              {$_("closed_campaigns.convert_to_active")}
            </span>
          </li>
          <li>
            <span class="fake-link" on:click={() => lock(item.id)}>
              {$_("closed_campaigns.convert_to_archived")}
            </span>
          </li>
        </ul>
      {:else}
        {$_("closed_campaigns.no_actions")}
      {/if}
    </ul>
  </svelte:fragment>
</AccordionList>
