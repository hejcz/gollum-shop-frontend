<script lang="ts">
import { Link } from "svelte-navigator";

  import { api, CampaignCandidate } from "../api/Api";
  import { role, user } from "../stores";
  import AccordionList from "../utils/AccordionList.svelte";
  import type { AccordionItem } from "../utils/accordion_item";

  let candidates: (CampaignCandidate & AccordionItem)[] = [];

  async function fetch(
    search: string
  ): Promise<(CampaignCandidate & AccordionItem)[]> {
    const fetched_candidates: CampaignCandidate[] =
      await api.fetchCampaignCandidates(search);
    return fetched_candidates.map(c => ({
      ...c,
      id: c.uuid,
    }));
  }
</script>

<h1>Campaigns proposals</h1>

<AccordionList items_provider={fetch} items={candidates}>
  <div slot="item-actions" let:item>
    <ul>
      {#if item.liking_users.includes($user)}
        <li>Unlike</li>
      {:else}
        <li>Like</li>
      {/if}
      {#if $role.might_modify_campaign()}
        <li><Link to="/campaigns/edit?from={item.id}">Convert to active campaign</Link></li>
      {/if}
    </ul>
  </div>
</AccordionList>
