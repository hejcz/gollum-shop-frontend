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
    {@const total = item.items.reduce(
      (acc, it) => acc + it.amount * it.price,
      0
    )}
    {@const to_pay = total - item.paid_value}
    <table class="table">
      <thead>
        <tr>
          <th scope="col">{$_("orders_history.name")}</th>
          <th scope="col">{$_("orders_history.quantity")}</th>
          <th scope="col">{$_("orders_history.price")}</th>
          <th scope="col">{$_("orders_history.item_total")}</th>
        </tr>
      </thead>
      <tbody>
        {#each item.items as i}
          <tr>
            <th scope="row">{i.name}</th>
            <td>{i.amount}</td>
            <td>{i.price} {$_('currency.pln')}</td>
            <td>{i.amount * i.price} {$_('currency.pln')}</td>
          </tr>
        {/each}
        <tr>
          <th scope="row">{$_("orders_history.total")}</th>
          <td />
          <td />
          <td>{total} {$_('currency.pln')}</td>
        </tr>
        <tr>
          <th scope="row">{$_("orders_history.paid_confirmed")}</th>
          <td />
          <td />
          <td>{item.paid_value} {$_('currency.pln')}</td>
        </tr>
        {#if to_pay > 0}
          <tr>
            <th scope="row">{$_("orders_history.left")}</th>
            <td />
            <td />
            <td class:text-danger={to_pay > 0}>{to_pay} {$_('currency.pln')}</td>
          </tr>
        {/if}
      </tbody>
    </table>
  </div>
</AccordionList>

<style>
  .badge {
    text-transform: uppercase;
  }

  th {
    text-decoration: none !important;
    font-weight: normal !important;
  }
</style>
