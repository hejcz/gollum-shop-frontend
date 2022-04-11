<script lang="ts">
  import { onMount } from "svelte";
  import { _ } from "svelte-i18n";

  import {
    AssignedToUser,
    Campaign,
    CampaignItem,
    Order,
    api,
  } from "../api/Api";
  import InProgressButton from "../utils/InProgressButton.svelte";

  export let uuid: string;

  let orders: (Order & AssignedToUser)[] = null;
  let campaign: Campaign;
  let totalItems = [];
  let totalGathered = 0;
  let totalPrice = 0;
  $: itemByUuid = new Map<string, CampaignItem>(
    campaign?.items?.map((item) => [item.uuid, item]) ?? []
  );

  $: {
    if (campaign != null && orders != null) {
      let itemOccurrences = new Map<string, number>();
      orders.forEach((order) =>
        order.items.forEach((item) => {
          const previous = itemOccurrences.get(item.item_uuid) ?? 0;
          itemOccurrences.set(item.item_uuid, previous + item.amount);
        })
      );
      totalItems = campaign.items
        .map((item) => ({
          ...item,
          total_amount: itemOccurrences.get(item.uuid) ?? 0,
        }))
        .filter((item) => item.total_amount > 0);
      totalPrice = totalItems.reduce(
        (acc, item) => acc + item.total_amount * item.price,
        0
      );
      totalGathered = orders.reduce((acc, order) => acc + order.paid_amount, 0);
    }
  }

  onMount(async () => {
    const [o, c] = await Promise.all([
      api.fetchCampaignOrders(uuid),
      api.fetchCampaign(uuid),
    ]);
    orders = o;
    campaign = c;
  });

  async function confirm(order: Order & AssignedToUser) {
    await api.updatePaidAmount(order);
  }
</script>

{#if orders === null}
  <h1>{$_("manage_orders.loading")}</h1>
{/if}

{#if campaign != null && orders != null}
  <h1>
    {$_("manage_orders.title", { values: { campaign_title: campaign.title } })}
  </h1>

  <h2>{$_("manage_orders.orders_summary")}</h2>
  <p>
    {$_("manage_orders.orders_summary.paid", {
      values: { totalGathered, totalPrice },
    })}
  </p>
  <ul>
    {#each totalItems as totalItem}
      <li>{totalItem.ordinal}. {totalItem.name}: {totalItem.total_amount}</li>
    {/each}
  </ul>

  <h2>{$_("manage_orders.per_user_summary")}</h2>
  {#each orders as order}
    <h3>{order.username}</h3>
    <div>
      <span>{$_("manage_orders.per_user_summary.paid")}</span>
      <input type="number" bind:value={order.paid_amount} class="money" />
      <span class="me-1">
        {$_("manage_orders.per_user_summary.out_of")}
        {order.items.reduce(
          (acc, item) =>
            acc + itemByUuid.get(item.item_uuid).price * item.amount,
          0
        )}
      </span>
      <InProgressButton
        on_click_function={async () => confirm(order)}
        label="Confirm" />
    </div>
    <ul>
      {#each order.items as item}
        <li>{itemByUuid.get(item.item_uuid).name}: {item.amount}</li>
      {/each}
    </ul>
  {/each}
{/if}

<style>
  .money {
    max-width: 120px;
  }
</style>
