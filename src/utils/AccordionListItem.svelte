<script lang="ts">
  import type { AccordionItem } from "./accordion_item";

  export let item: AccordionItem;
</script>

<div class="accordion-item">
  <h2 class="accordion-header" id="headingOne">
    <div style="display: flex;">
      <div class="d-none d-md-inline">
        {#if item.url == null}
          <img
            class="accordion-list-item"
            src={item.img_url}
            alt="item miniature" />
        {:else}
          <a href={item.url} target="_blank">
            <img
              class="accordion-list-item"
              src={item.img_url}
              alt="item miniature" />
          </a>
        {/if}
      </div>

      <button
        class="accordion-button collapsed"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target={"#collapse" + item.id}
        aria-expanded="true"
        aria-controls={"collapse" + item.id}>
        <slot name="title" />
      </button>
    </div>
  </h2>
  <div
    id={"collapse" + item.id}
    class="accordion-collapse collapse"
    aria-labelledby="headingOne"
    data-bs-parent="#accordionExample">
    <div class="accordion-body">
      <slot name="actions" />
    </div>
  </div>
</div>

<style>
  img {
    width: 90px;
    height: 52px;
    object-fit: cover;
    overflow: hidden;
    float: left;
    font-size: 1rem;
    line-height: 26px;
    text-align: center;
  }

  .accordion-button {
    width: none !important;
    flex: 1;
  }

  .accordion-button:focus {
    box-shadow: none !important;
  }
</style>
