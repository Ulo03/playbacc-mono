<script lang="ts">
  import { User } from "lucide-svelte";

  type Props = {
    src: string | null;
    alt: string;
    class?: string;
    lazy?: boolean;
  };

  let { src, alt, class: className = "", lazy = false }: Props = $props();
</script>

{#if src}
  <img
    {src}
    {alt}
    loading={lazy ? "lazy" : "eager"}
    class="rounded-full object-cover {className}"
  />
{:else}
  <div
    class="flex items-center justify-center rounded-full bg-neutral-800 {className}"
    role="img"
    aria-label={alt}
  >
    <User class="h-1/2 w-1/2 text-neutral-500" />
  </div>
{/if}
