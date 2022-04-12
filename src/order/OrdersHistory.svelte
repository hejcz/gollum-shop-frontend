<script lang="ts">
  import { _ } from "svelte-i18n";

  import { api, Campaign, CampaignItem } from "../api/Api";
  import AccordionList from "../utils/AccordionList.svelte";
  import type { AccordionItem } from "../utils/accordion_item";

  interface PastItem {
    name: string;
    price: number;
    amount: number;
  }

  interface PastOrder {
    campaign_title: string;
    paid_value: number;
    order_value: number;
    items: PastItem[];
  }

  async function fetch(search: string): Promise<(PastOrder & AccordionItem)[]> {
    const fetched_orders = await api.fetchUserOrders();
    const fetched_campaigns = await api.fetchCampaigns({
      uuids: fetched_orders.map((it) => it.campaign_uuid),
      titleLike: search,
    });
    const uuid_to_campaign = new Map<string, Campaign>(
      fetched_campaigns.map((it) => [it.uuid, it])
    );
    const new_orders: (PastOrder & AccordionItem)[] = [];
    for (const o of fetched_orders) {
      const c = uuid_to_campaign.get(o.campaign_uuid);
      if (c == null) {
        continue;
      }
      const uuid_to_item = new Map<string, CampaignItem>(
        c.items.map((it) => [it.uuid, it])
      );
      const items = o.items.map((it) => {
        const { name, price } = uuid_to_item.get(it.item_uuid);
        return { name, price, amount: it.amount };
      });
      const order_value = items.reduce((acc, i) => acc + i.price * i.amount, 0);
      new_orders.push({
        campaign_title: c.title,
        paid_value: o.paid_amount,
        order_value,
        items,
        title: c.title,
        id: c.uuid,
        img_url: c.img_url,
      });
    }
    return new_orders;
  }
</script>

<h1>{$_("orders_history.title")}</h1>

<AccordionList items_provider={fetch}>
  <svelte:fragment slot="title" let:item>
    {#if item.paid_value < item.order_value}
      <span class="badge bg-danger">{$_("orders_history.unpaid")}</span>
    {:else}
      <span class="badge bg-success">{$_("orders_history.paid")}</span>
    {/if}
    <div class="ms-3">
      {#if item.url == null}
        {item.title}
      {:else}
        <a href={item.url} target="_blank">{item.title}</a>
      {/if}
    </div>
  </svelte:fragment>

  <div slot="item-actions" let:item>
    {#if item.order_value > item.paid_value}
      <p>
        {$_("orders_history.to_pay", {
          values: {
            to_pay: item.order_value - item.paid_value,
            paid: item.paid_value,
          },
        })}
      </p>
    {/if}
    <ul>
      {#each item.items as i}
        <li>{i.amount} x {i.name} ({i.price} PLN)</li>
      {/each}
    </ul>
  </div>
</AccordionList>

<style>
  .badge {
    text-transform: uppercase;
  }
</style>
