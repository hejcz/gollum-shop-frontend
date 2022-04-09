<script lang="ts">
  import { debounce } from "../utils/debounce";
  import type { AccordionItem } from "./accordion_item";

  export let items: AccordionItem[];
  export let items_provider: (
    search: string | null
  ) => Promise<AccordionItem[]>;
  let search: string = "";

  const filter = debounce(async () => {
    items = await items_provider(search);
  }, 500);
</script>

<div class="accordion-list-nav">
  <input
    type="text"
    bind:value={search}
    on:keyup={filter}
    placeholder="Filter by title" />
  <slot name="actions" />
</div>

<style>
  .accordion-list-nav {
    display: flex;
    justify-content: flex-start;
    gap: 0.5em;
  }
</style>
