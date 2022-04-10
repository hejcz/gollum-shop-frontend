<script lang="ts">
  import { onMount } from "svelte";

  import AccordionListItem from "./AccordionListItem.svelte";
  import AccordionListNav from "./AccordionListNav.svelte";
  import type { AccordionItem } from "./accordion_item";

  export let items_provider: (
    search: string | null
  ) => Promise<AccordionItem[]>;
  export let items = [];

  onMount(async () => {
    items = await items_provider(null);
  });
</script>

<AccordionListNav bind:items {items_provider}>
  <slot slot="actions" name="nav-actions" />
</AccordionListNav>

<div class="row campaigns-row">
  <div class="mb-2 mt-2">
    <div class="accordion" id="accordionExample">
      {#each items as item}
        <AccordionListItem {item}>
          <slot name="item-actions" slot="actions" {item} />
          <slot name="title" slot="title" {item}>
            {#if item.url == null}
              {item.title}
            {:else}
              <a href={item.url} target="_blank">{item.title}</a>
            {/if}
          </slot>
        </AccordionListItem>
      {/each}
    </div>
  </div>
</div>
