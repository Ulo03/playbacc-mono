<script lang="ts">
  import type { Component, Snippet } from "svelte";
  import type { HTMLButtonAttributes } from "svelte/elements";

  type Props = HTMLButtonAttributes & {
    Icon: Component;
    children: Snippet;
  };

  let { Icon, children, ...rest }: Props = $props();
</script>

<button
  {...rest}
  class="group w-full inline-flex items-center justify-center gap-3 border-3 border-[var(--btn-color)] px-5 py-3 duration-200 hover:bg-[var(--btn-color)]"
>
  <span
    class="size-5 text-[var(--icon-color,var(--btn-color))] duration-200 group-hover:text-white"
    ><Icon /></span
  >
  <span class="text-[var(--btn-color)] duration-200 group-hover:text-white"
    >{@render children()}</span
  >
</button>
