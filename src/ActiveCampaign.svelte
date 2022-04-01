<script lang="ts">
    import { Link } from "svelte-navigator";
    import { role, user } from "./stores";
    import {
        Campaign,
        likeCampaign,
        unlikeCampaign,
    } from "./api/Api";

    let r = $role
    export let campaign: Campaign;
    const uuid = campaign.uuid;

    async function like() {
        campaign = await likeCampaign(uuid);
    }

    async function unlike() {
        campaign = await unlikeCampaign(uuid);
    }
</script>

{#if campaign.url == null}
    {campaign.title}
{:else}
    <a href={campaign.url} target="_blank">{campaign.title}</a>
{/if}
<ul>
    <li>
        Likes: {campaign.likes.length}
        {#if campaign.likes.indexOf($user) === -1}
            <span class="fake-link" on:click={like}>Like</span>
        {:else}
            <span class="fake-link" on:click={unlike}>Unlike</span>
        {/if}
    </li>
    <li>
        <Link to="/order/{uuid}">Order / Modify order</Link>
    </li>
    {#if $role.might_modify_campaign()}
        <li>
            <Link to="/edit/{uuid}">Edit campaign</Link>
        </li>
        <slot id="lock">No lock component</slot>
    {/if}
</ul>
