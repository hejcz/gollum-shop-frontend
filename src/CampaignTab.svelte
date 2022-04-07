<script lang="ts">
  import type { Campaign } from "./api/Api";

  export let campaign: Campaign;
</script>

<div class="accordion-item">
  <h2 class="accordion-header" id="headingOne">
    <div style="display: flex;">
      {#if campaign.url == null}
        <img src={campaign.img_url} alt="campaign minature" />
      {:else}
        <a href={campaign.url} target="_blank">
          <img src={campaign.img_url} alt="campaign minature" />
        </a>
      {/if}

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
    </div>
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

<style>
  img {
    width: 90px;
    height: 52px;
    object-fit: cover;
  }

  .accordion-button {
    width: none !important;
    flex: 1;
  }

  .accordion-button:focus {
    box-shadow: none !important;
  }
</style>
