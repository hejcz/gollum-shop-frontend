<script lang="ts">
  import { faHeart } from "@fortawesome/free-solid-svg-icons";
  import { faHeart as faHeartOpen } from "@fortawesome/free-regular-svg-icons";
  import Fa from "svelte-fa";
  import { Link } from "svelte-navigator";
  import { api,CampaignCandidate } from "../api/Api";
  import { role,user } from "../stores";
  import AccordionList from "../utils/AccordionList.svelte";
  import type { AccordionItem } from "../utils/accordion_item";

  let candidates: (CampaignCandidate & AccordionItem)[] = [];

  async function fetch(
    search: string
  ): Promise<(CampaignCandidate & AccordionItem)[]> {
    const fetched_candidates: CampaignCandidate[] =
      await api.fetchCampaignCandidates(search);
    return fetched_candidates.map((c) => ({
      ...c,
      id: c.uuid,
    }));
  }

  async function like(candidate_uuid: string) {
    await api.likeCandidate(candidate_uuid);
    candidates = await fetch(null);
  }

  async function unlike(candidate_uuid: string) {
    await api.unlikeCandidate(candidate_uuid);
    candidates = await fetch(null);
  }
</script>

<h1>Campaigns proposals</h1>

<AccordionList items_provider={fetch} items={candidates}>
  <svelte:fragment slot="title" let:item>
    {#if item.url == null}
      {item.title}
    {:else}
      <a href={item.url} target="_blank">{item.title}</a>
    {/if}
    <!-- https://stackoverflow.com/questions/67281841/bootstrap-link-in-accordion-header-stoppropagation-not-working -->
    {#if item.liking_users.includes($user)}
      <button
        class="ms-3 btn btn-light non-collapsing"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target
        on:click={() => unlike(item.id)}>
        <Fa icon={faHeart} primaryColor="red" /> Liked {item.liking_users.length} times
      </button>
    {:else}
      <button
        class="ms-3 btn btn-light non-collapsing"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target
        on:click={() => like(item.id)}>
        <Fa icon={faHeartOpen} /> Liked {item.liking_users.length} times
      </button>
    {/if}
  </svelte:fragment>
  <div slot="item-actions" let:item>
    <ul>
      {#if $role.might_modify_campaign()}
        <li>
          <Link to="/campaigns/edit?from={item.id}"
            >Convert to active campaign</Link>
        </li>
      {/if}
    </ul>
  </div>
</AccordionList>
