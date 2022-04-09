<script lang="ts">
  import { Link } from "svelte-navigator";
  import { api, Campaign } from "../api/Api";
  import { role } from "../stores";
  import AccordionList from "../utils/AccordionList.svelte";
  import type { AccordionItem } from "../utils/accordion_item";

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

<h1>Campaigns archive</h1>

<AccordionList items_provider={fetch} items={inactive_campaigns}>
  <div slot="item-actions" let:item>
    {#if $role.might_modify_campaign()}
      <ul>
        <li>
          <Link to="/edit/{item.id}">Edit campaign</Link>
        </li>
        <li>
          <Link to="/orders/{item.id}">Manage orders</Link>
        </li>
        <li>
          <span class="fake-link" on:click={() => unlock(item.id)}>
            Unlock campaign
          </span>
        </li>
      </ul>
    {:else}
      Nothing to do here
    {/if}
  </div>
</AccordionList>
