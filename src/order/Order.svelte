<script lang="ts">
  import { onMount } from "svelte";

  import { api, Order, Campaign, OrderedItem } from "../api/Api";
  import InProgressButton from "../utils/InProgressButton.svelte";

  export let uuid: string;

  let campaign: Campaign = null;
  let items = [];
  let paid = 0;
  $: totalPrice = items
    .map((i) => i.item.price * i.amount)
    .reduce((acc, x) => acc + x, 0);

  onMount(async () => {
    const fetchedOrder: Order = await api.fetchOrder(uuid);
    const fetchedCampaign: Campaign = await api.fetchCampaign(uuid);
    if (fetchedCampaign == null) {
      items = [];
      campaign = null;
      paid = 0;
    } else {
      // set ordered amounts
      const orderItems = new Map<string, OrderedItem>();
      fetchedOrder.items.forEach((i) => orderItems.set(i.item_uuid, i));
      items = fetchedCampaign.items.map((i) => ({
        amount: orderItems.get(i.uuid)?.amount ?? 0,
        item: { ...i },
      }));
      paid = fetchedOrder.paid_amount;
      campaign = fetchedCampaign;
    }
  });

  async function order() {
    await api.orderCampaign(
      uuid,
      items
        .filter((i) => i.amount > 0)
        .map((i) => ({ item_uuid: i.item.uuid, amount: i.amount }))
    );
  }
</script>

{#if campaign == null}
  <h1>Preparing order page</h1>
{:else}
  <h1>Order {campaign.title}</h1>

  <div class="mb-2">
    <InProgressButton
      on_click_function={async () => order()}
      label="Order"
      disabled_predicate={() => totalPrice <= 0} />
    {#if items.length === 0}
      <span>There is nothing to order in this campaign yet.</span>
    {:else}
      <span>Paid {paid} out of {totalPrice}</span>
    {/if}
  </div>
  {#each items as { amount, item }}
    <div class="card mb-2" style="width: 100%;">
      <div class="card-body">
        <h5 class="card-title" class:fade-text={amount == null || amount === 0}>
          {item.name}
        </h5>
        <div class="input-group card-text">
          <span class="input-group-text price">{item.price} PLN</span>
          <button
            type="button"
            class="btn btn-outline-secondary"
            on:click={() => amount++}>
            +1
          </button>
          <button
            type="button"
            class="btn btn-outline-secondary"
            on:click={() =>
              (amount = amount - 1 <= 0 ? null : Math.max(0, amount - 1))}>
            -1
          </button>
          <input
            type="number"
            id="amount"
            class="form-control"
            bind:value={amount}
            min="0" />
        </div>
      </div>
    </div>
  {/each}
{/if}

<style>
  .fade-text {
    color: grey;
  }

  #amount {
    text-align: left;
  }

  .price {
    width: 90px;
  }
</style>
