<script lang="ts">
  import { Link, useNavigate } from "svelte-navigator";
  import { v4 as uuidv4 } from "uuid";
  import { api, Campaign } from "../api/Api";
  import { role } from "../stores";
  import AccordionList from "../utils/AccordionList.svelte";
  import type { AccordionItem } from "../utils/accordion_item";

  const navigate = useNavigate();
  const fetch_filter = { active: true };

  let active_campaigns = [];

  function add_new_campaign() {
    navigate(`/edit/${uuidv4()}`);
  }

  async function lock(uuid: string) {
    await api.lockCampaign(uuid);
    active_campaigns = await fetch(null);
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

<h1>Active campaigns</h1>

<AccordionList items_provider={fetch} items={active_campaigns}>
  <svelte:fragment slot="nav-actions">
    {#if $role.might_modify_campaign()}
      <button type="button" class="btn btn-primary" on:click={add_new_campaign}>
        + Add campaign
      </button>
    {/if}
  </svelte:fragment>
  <svelte:fragment slot="item-actions" let:item>
    <ul>
      <li>
        <Link to="/order/{item.id}">Order / Modify order</Link>
      </li>
      {#if $role.might_modify_campaign()}
        <li>
          <Link to="/edit/{item.id}">Edit campaign</Link>
        </li>
        <li>
          <Link to="/orders/{item.id}">Manage orders</Link>
        </li>
        <li>
          <span class="fake-link" on:click={() => lock(item.id)}>
            Lock campaign
          </span>
        </li>
      {/if}
    </ul>
  </svelte:fragment>
</AccordionList>
