<script lang="ts">
    import { Link } from "svelte-navigator";
    import { role, user } from "./stores";
    import type { Campaign } from "./api/Api";

    let r = $role
    export let campaign: Campaign;
    const uuid = campaign.uuid;
</script>

{#if campaign.url == null}
    {campaign.title}
{:else}
    <a href={campaign.url} target="_blank">{campaign.title}</a>
{/if}
<ul>
    <li>
        <Link to="/order/{uuid}">Order / Modify order</Link>
    </li>
    {#if $role.might_modify_campaign()}
        <li>
            <Link to="/edit/{uuid}">Edit campaign</Link>
        </li>
        <li>
            <Link to="/orders/{uuid}">Manage orders</Link>
        </li>
        <slot id="lock">No lock component</slot>
    {/if}
</ul>
