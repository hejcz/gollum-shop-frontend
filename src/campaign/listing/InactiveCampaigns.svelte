<script lang="ts">
  import { Link } from "svelte-navigator";
  import { api, Campaign } from "../../api/Api";
  import { role } from "../../stores";
  import AccordionList from "../../utils/AccordionList.svelte";
  import type { AccordionItem } from "../../utils/accordion_item";
  import { _ } from "svelte-i18n";

  const fetch_filter = { active: false };

  let inactive_campaigns = [];

  async function unlock(uuid: string) {
    await api.unlockCampaign(uuid);
    inactive_campaigns = await fetch(null);
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

<h1>{$_("archived_campaigns.title")}</h1>

<AccordionList items_provider={fetch} items={inactive_campaigns}>
  <div slot="item-actions" let:item>
    {#if $role.is_admin()}
      <ul>
        <li>
          <Link to="/campaigns/edit/{item.id}">
            {$_("archived_campaigns.edit_campaign")}
          </Link>
        </li>
        <li>
          <Link to="/orders/{item.id}">
            {$_("archived_campaigns.manage_orders")}
          </Link>
        </li>
        <li>
          <span class="fake-link" on:click={() => unlock(item.id)}>
            {$_("archived_campaigns.convert_to_active")}
          </span>
        </li>
      </ul>
    {:else}
      {$_("archived_campaigns.no_actions")}
    {/if}
  </div>
</AccordionList>
