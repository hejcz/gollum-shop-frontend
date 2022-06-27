<script lang="ts">
  import { Link, useNavigate } from "svelte-navigator";
  import { api, Campaign } from "../api/Api";
  import { role } from "../stores";
  import AccordionList from "../utils/AccordionList.svelte";
  import type { AccordionItem } from "../utils/accordion_item";
  import { _ } from "svelte-i18n";

  const navigate = useNavigate();
  const fetch_filter = { active: true };

  let active_campaigns = [];

  function add_new_campaign() {
    navigate(`/campaigns/edit`);
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

<h1>{$_("active_campaigns.title")}</h1>

<AccordionList items_provider={fetch} items={active_campaigns}>
  <svelte:fragment slot="nav-actions">
    {#if $role.is_admin()}
      <button type="button" class="btn btn-primary" on:click={add_new_campaign}>
        + {$_("active_campaigns.add_campaign")}
      </button>
    {/if}
  </svelte:fragment>
  <svelte:fragment slot="item-actions" let:item>
    <ul>
      <li>
        <Link to="/order/{item.id}">{$_("active_campaigns.order")}</Link>
      </li>
      {#if $role.is_admin()}
        <li>
          <Link to="/campaigns/edit/{item.id}">
            {$_("active_campaigns.edit")}
          </Link>
        </li>
        <li>
          <Link to="/orders/{item.id}">
            {$_("active_campaigns.manage_orders")}
          </Link>
        </li>
        <li>
          <span class="fake-link" on:click={() => lock(item.id)}>
            {$_("active_campaigns.lock")}
          </span>
        </li>
      {/if}
    </ul>
  </svelte:fragment>
</AccordionList>
