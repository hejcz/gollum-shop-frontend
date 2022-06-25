<script lang="ts">
  import { onMount } from "svelte";
  import { _ } from "svelte-i18n";

  import { api, Order, Campaign, OrderedItem } from "../api/Api";
  import InProgressButton from "../utils/InProgressButton.svelte";

  export let uuid: string;

  let campaign: Campaign = null;
  let items = [];
  let paid = 0;
  let new_order = null;
  $: totalPrice = items
    .map((i) => i.item.price * i.amount)
    .reduce((acc, x) => acc + x, 0);

  onMount(async () => {
    let fetchedOrder: Order = await api.fetchOrder(uuid);
    const fetchedCampaign: Campaign = await api.fetchCampaign(uuid);
    new_order = fetchedOrder == null;
    if (fetchedCampaign == null) {
      items = [];
      campaign = null;
      paid = 0;
    } else {
      // set ordered amounts
      const orderItems = new Map<string, OrderedItem>();
      if (fetchedOrder != null) {
        fetchedOrder.items.forEach((i) => orderItems.set(i.item_uuid, i));
      }
      items = fetchedCampaign.items.map((i) => ({
        amount: orderItems.get(i.uuid)?.amount ?? 0,
        item: { ...i },
      }));
      paid = fetchedOrder == null ? 0 : fetchedOrder.paid_amount;
      campaign = fetchedCampaign;
    }
  });

  async function order() {
    await api.orderCampaign(uuid, {
      is_new: new_order,
      items: items
        .filter((i) => i.amount > 0)
        .map((i) => ({ item_uuid: i.item.uuid, amount: i.amount })),
    });
  }
</script>

{#if campaign == null}
  <h1>{$_("order.loading")}</h1>
{:else}
  <h1>{$_("order.title", { values: { campaign_title: campaign.title } })}</h1>

  <div class="mb-2">
    <InProgressButton
      on_click_function={async () => order()}
      label={$_("order.confirm")}
      disabled_predicate={() => totalPrice <= 0 && new_order} />
  </div>
  {#if items.length === 0}
    <div>
      <span>{$_("order.no_items")}</span>
    </div>
  {/if}
  {#each items as { amount, item }}
    <div class="card mb-2" style="width: 100%;">
      <div class="card-body">
        <div class="card-title">
          <h5 class:fade-text={amount == null || amount === 0}>
            {item.ordinal}. {item.name}
            <span class="ms-2 badge bg-secondary">
              {item.price}
              {$_("currency.pln")}
            </span>
          </h5>
        </div>
        <div class="input-group card-text">
          <span class="input-group-text">{$_("order.quantity")}</span>
          <button
            type="button"
            class="btn btn-outline-secondary change-amount"
            on:click={() => amount++}>
            +
          </button>
          <button
            type="button"
            class="btn btn-outline-secondary change-amount"
            on:click={() => (amount = Math.max(0, amount - 1))}>
            -
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

  .badge {
    vertical-align: top;
  }

  .change-amount {
    min-width: 40px;
  }
</style>
