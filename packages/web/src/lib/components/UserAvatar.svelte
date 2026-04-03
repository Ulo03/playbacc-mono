<script lang="ts">
  type Props = {
    src: string | null;
    alt: string;
    class?: string;
  };

  let { src, alt, class: className = "" }: Props = $props();
</script>

{#if src}
  <img {src} {alt} class="rounded-full object-cover {className}" />
{:else}
  <div
    class="flex items-center justify-center rounded-full bg-neutral-800 {className}"
    role="img"
    aria-label={alt}
  >
    <svg
      class="h-1/2 w-1/2 text-neutral-500"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M5 20c0-4 3-7 7-7s7 3 7 7" />
    </svg>
  </div>
{/if}
