<script lang="ts">
  import type { Campaign } from "./api/Api";

  export let campaign: Campaign;
</script>

<div class="accordion-item">
  <h2 class="accordion-header" id="headingOne">
    <button
      class="accordion-button collapsed"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target={"#collapse" + campaign.uuid}
      aria-expanded="true"
      aria-controls={"collapse" + campaign.uuid}>
      {#if campaign.url == null}
        {campaign.title}
      {:else}
        <a href={campaign.url} target="_blank">{campaign.title}</a>
      {/if}
    </button>
  </h2>
  <div
    id={"collapse" + campaign.uuid}
    class="accordion-collapse collapse"
    aria-labelledby="headingOne"
    data-bs-parent="#accordionExample">
    <div class="accordion-body">
      <slot id="actions" />
    </div>
  </div>
</div>
