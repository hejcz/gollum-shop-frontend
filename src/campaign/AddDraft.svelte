<script lang="ts">
  import { _ } from "svelte-i18n";
  import { v4 } from "uuid";
  import { api,CampaignCandidate } from "../api/Api";
  import InProgressButton from "../utils/InProgressButton.svelte";

  let save_in_progress = false;

  const newDraft: () => CampaignCandidate = () => ({
    uuid: v4(),
    locked: false,
    title: "",
    img_url: "",
    url: "",
    liking_users: []
  });

  let draft: CampaignCandidate = newDraft();

  async function save() {
    draft = await api.addCandidate(draft);
  }
</script>

  <h1>
    {$_("add_draft.title_add", { values: { title: draft.title } })}
  </h1>

  <div class="mb-2">
    <InProgressButton
      on_click_function={save}
      label={$_("add_draft.save")}
      bind:in_progress={save_in_progress} />
  </div>
  <div class="mb-3">
    <label for="title" class="form-label">
      {$_("add_draft.campaign_title")}
    </label>
    <input
      class="form-control"
      type="text"
      id="title"
      bind:value={draft.title}
      disabled={save_in_progress} />
  </div>
  <div class="mb-3">
    <label class="form-label" for="campaign_url">
      {$_("add_draft.campaign_url")}
    </label>
    <input
      class="form-control"
      type="text"
      id="campaign_url"
      bind:value={draft.url}
      disabled={save_in_progress} />
  </div>
  <div class="mb-3">
    <label class="form-label" for="campaign_url">
      {$_("add_draft.image_url")}
    </label>
    <input
      class="form-control"
      type="text"
      id="campaign_img_url"
      bind:value={draft.img_url}
      disabled={save_in_progress} />
  </div>
