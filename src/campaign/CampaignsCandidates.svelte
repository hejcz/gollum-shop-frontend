<script lang="ts">
  import { faHeart } from "@fortawesome/free-solid-svg-icons";
  import { faHeart as faHeartOpen } from "@fortawesome/free-regular-svg-icons";
  import Fa from "svelte-fa";
  import { Link, useNavigate } from "svelte-navigator";
  import { api, CampaignCandidate } from "../api/Api";
  import { role, user, user_uuid } from "../stores";
  import AccordionList from "../utils/AccordionList.svelte";
  import type { AccordionItem } from "../utils/accordion_item";
  import { _ } from "svelte-i18n";

  let candidates: (CampaignCandidate & AccordionItem)[] = [];

  const sort_by_likes = (a: CampaignCandidate, b: CampaignCandidate) => {
    if (a.liking_users.length > b.liking_users.length) {
      return -1;
    }
    if (a.liking_users.length < b.liking_users.length) {
      return 1;
    }
    if (a.title > b.title) {
      return 1;
    }
    if (a.title < b.title) {
      return -1;
    }
    return 0;
  };

  async function fetch(
    search: string
  ): Promise<(CampaignCandidate & AccordionItem)[]> {
    const fetched_candidates: CampaignCandidate[] =
      await api.fetchCampaignCandidates(search);
    return fetched_candidates.sort(sort_by_likes).map((c) => ({
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

  const navigate = useNavigate();

  function add_draft() {
    navigate(`/new-draft`);
  }
</script>

<h1>{$_("proposed_campaigns.title")}</h1>

<AccordionList items_provider={fetch} items={candidates}>
  <svelte:fragment slot="nav-actions">
    <button type="button" class="btn btn-primary" on:click={add_draft}>
      + {$_("proposed_campaigns.add_draft")}
    </button>
  </svelte:fragment>
  <svelte:fragment slot="title" let:item>
    <div class="row">
      <div class="col">
        {#if item.url == null}
          {item.title}
        {:else}
          <a href={item.url} target="_blank">{item.title}</a>
        {/if}
      </div>
      <div class="col-12 col-md">
        <!-- https://stackoverflow.com/questions/67281841/bootstrap-link-in-accordion-header-stoppropagation-not-working -->
        {#if item.liking_users.includes($user_uuid)}
          <button
            class="btn btn-light non-collapsing"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target
            on:click={() => unlike(item.id)}>
            <Fa icon={faHeart} primaryColor="red" />
            {$_(
              item.liking_users.length === 1
                ? "proposed_campaigns.single_like"
                : "proposed_campaigns.likes",
              { values: { count: item.liking_users.length } }
            )}
          </button>
        {:else}
          <button
            class="btn btn-light non-collapsing"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target
            on:click={() => like(item.id)}>
            <Fa icon={faHeartOpen} />
            {$_(
              item.liking_users.length === 1
                ? "proposed_campaigns.single_like"
                : "proposed_campaigns.likes",
              { values: { count: item.liking_users.length } }
            )}
          </button>
        {/if}
      </div>
    </div>
  </svelte:fragment>
  <div slot="item-actions" let:item>
    <ul>
      {#if $role.might_modify_campaign()}
        <li>
          <Link to="/campaigns/edit?from={item.id}">
            {$_("proposed_campaigns.convert_to_active")}
          </Link>
        </li>
      {:else}
        {$_("proposed_campaigns.no_actions")}
      {/if}
    </ul>
  </div>
</AccordionList>

<style>
  .row {
    width: 100%;
  }

  .btn {
    padding-top: 0px;
    padding-bottom: 0px;
  }
</style>
