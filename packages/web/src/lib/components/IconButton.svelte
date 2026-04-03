<script lang="ts">
  import type { Component, Snippet } from "svelte";
  import { Button, type ButtonRootProps } from "bits-ui";

  type Props = ButtonRootProps & {
    Icon: Component;
    children: Snippet;
  };

  let { Icon, children, class: className, ...rest }: Props = $props();
</script>

<Button.Root
  {...rest}
  class="group w-full inline-flex cursor-pointer items-center justify-center gap-3 border-3 border-[var(--btn-color)] px-5 py-2.5 duration-200 hover:bg-[var(--btn-color)] sm:py-3 {className}"
>
  <span
    class="size-5 text-[var(--icon-color,var(--btn-color))] duration-200 group-hover:text-white"
  >
    <Icon />
  </span>
  <span
    class="text-sm text-[var(--btn-color)] duration-200 sm:text-base group-hover:text-white"
  >
    {@render children()}
  </span>
</Button.Root>
