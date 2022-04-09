<script lang="ts">
  import { onMount } from "svelte";
  import { api, Campaign, CampaignItem } from "../api/Api";

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

  let orders: PastOrder[] = [];

  onMount(async () => {
    const fetched_orders = await api.fetchUserOrders();
    const fetched_campaigns = await api.fetchCampaigns({
      uuids: fetched_orders.map((it) => it.campaign_uuid),
    });
    const uuid_to_campaign = new Map<string, Campaign>(
      fetched_campaigns.map((it) => [it.uuid, it])
    );
    const new_orders: PastOrder[] = [];
    for (const o of fetched_orders) {
      const c = uuid_to_campaign.get(o.campaign_uuid);
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
      });
    }
    orders = new_orders;
  });
</script>

<h1>Orders history</h1>

{#each orders as order}
  <h2>
    {order.campaign_title}
  </h2>
  {#if order.order_value <= order.paid_value}
    <p style="color: green;">Zamówienie opłacone</p>
  {:else}
    <p style="color: red;">
      Do zapłaty pozostało: {order.order_value - order.paid_value}
    </p>
  {/if}
  <ul>
    {#each order.items as item}
      <li>Name: {item.name}, price: {item.price}, amount: {item.amount}</li>
    {/each}
  </ul>
{/each}
