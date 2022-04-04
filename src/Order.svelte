<script lang="ts">
    import { onMount } from "svelte";

    import {
        fetchCampaign,
        fetchOrder,
        orderCampaign,
        Order,
        Campaign,
        OrderedItem,
    } from "./api/Api";

    export let uuid: string;

    let campaign: Campaign = null;
    let items = [];
    let orderInProgress = false;
    let last_successful_order: Date | null = null;
    let paid = 0
    $: totalPrice = items
        .map((i) => i.item.price * i.amount)
        .reduce((acc, x) => acc + x, 0);

    onMount(async () => {
        const fetchedOrder: Order = await fetchOrder(uuid);
        const fetchedCampaign: Campaign = await fetchCampaign(uuid);
        if (fetchedCampaign == null) {
            items = [];
            campaign = null;
            paid = 0;
        } else {
            // set ordered amounts
            const orderItems = new Map<string, OrderedItem>();
            fetchedOrder.items.forEach((i) => orderItems.set(i.item_uuid, i));
            items =
                fetchedCampaign.items.map((i) => ({
                    amount: orderItems.get(i.uuid)?.amount ?? null,
                    item: { ...i },
                }));
            paid = fetchedOrder.paid_amount
            campaign = fetchedCampaign;
        }
    });

    async function order() {
        orderInProgress = true;
        await orderCampaign(
            uuid,
            items.filter(i => i.amount > 0)
                .map((i) => ({ item_uuid: i.item.uuid, amount: i.amount }))
        );
        orderInProgress = false;
        last_successful_order = new Date();
    }
</script>

{#if campaign == null}
    <h1>Preparing order page</h1>
{:else}
    <h1>Order {campaign.title}</h1>

    <div class="mb-2">
        <button type="button" class="btn btn-primary" on:click={() => order()} disabled={totalPrice <= 0 || orderInProgress}>Order</button>
        {#if items.length === 0}
            <span>There is nothing to order in this campaign yet.</span>
        {:else}
            <span>Paid {paid} out of {totalPrice}</span>
        {/if}
    </div>
    {#if last_successful_order != null}
        <div class="my-2" style="color: green">Last successful order: {last_successful_order.toLocaleTimeString("pl-PL")}</div>
    {/if}

    <div class="row align-items-end">
    {#each items as { amount, item }}
        <div class="col-12 col-lg-3">
            <p>{item.name}</p>
            <div class="input-group mb-3">
                <span class="input-group-text">{item.price} PLN</span>
                <span class="input-group-text">Amount</span>
                <input type="number" id="amount" class="form-control" bind:value={amount} min="0" />
            </div>
        </div>
    {/each}
    </div>
{/if}
