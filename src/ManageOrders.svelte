<script lang="ts">
import { onMount } from "svelte";

    import { AssignedToUser, Campaign, CampaignItem, fetchCampaign, fetchOrders, Order, updatePaidAmount } from "./api/Api";

    export let uuid: string

    let orders: (Order & AssignedToUser)[] = null
    let campaign: Campaign
    let totalItems = []
    let totalGathered = 0
    let totalPrice = 0
    $: itemByUuid = new Map<string, CampaignItem>(campaign?.items?.map(item => [item.uuid, item]) ?? [])

    $: {
        if (campaign != null && orders != null) {
            let itemOccurrences = new Map<string, number>()
            orders.forEach(order => order.items.forEach(item => {
                const previous = itemOccurrences.get(item.order_uuid) ?? 0
                itemOccurrences.set(item.order_uuid, previous + item.amount)
            }))
            totalItems = campaign.items.map(item => ({...item, total_amount: itemOccurrences.get(item.uuid) ?? 0}))
                .filter(item => item.total_amount > 0)
            totalPrice = totalItems.reduce((acc, item) => acc + item.total_amount * item.price, 0)
            totalGathered = orders.reduce((acc, order) => acc + order.paid_amount, 0)
        }
    }

    onMount(async () => {
        const [o, c] = await Promise.all([fetchOrders(uuid), fetchCampaign(uuid)])
        console.log(o)
        orders = o
        campaign = c
    })

    async function confirm(order: Order & AssignedToUser) {
        updatePaidAmount(order)
    }
</script>

{#if orders === null}
    <h1>Loading data...</h1>
{/if}

{#if campaign != null && orders != null}
    <h1>Manage orders for {campaign.title}</h1>

    <h2>Items to order</h2>
    <p>Gathered {totalGathered} out of {totalPrice}</p>
    <ul>
        {#each totalItems as totalItem}
            <li>{totalItem.name}: {totalItem.total_amount}</li>
        {/each}
    </ul>

    <h2>Orders</h2>
    {#each orders as order}
        <h3>{order.username}</h3>
        <div>
            <span>Paid </span>
            <input type="text" bind:value={order.paid_amount} />
            <span> out of {order.items.reduce((acc, item) => acc + itemByUuid.get(item.order_uuid).price * item.amount, 0)}</span>
            <button type="button" on:click={() => confirm(order)}>Confirm</button>
        </div>
        <ul>
        {#each order.items as item}
            <li>{itemByUuid.get(item.order_uuid).name}: {item.amount}</li>
        {/each}
        </ul>
    {/each}
{/if}

<!-- total per item -->
<!-- rozbicie per user + możliwość oznaczenia że wpłacił kaskę -->