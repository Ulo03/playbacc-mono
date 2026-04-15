<script lang="ts">
  import type { Snippet } from "svelte";

  type Props = {
    id: string;
    label: string;
    value: string;
    placeholder?: string;
    error?: string | null;
    borderClass?: string;
    oninput?: () => void;
    badge?: Snippet;
    hint?: Snippet;
  };

  let {
    id,
    label,
    value = $bindable(),
    placeholder,
    error,
    borderClass,
    oninput,
    badge,
    hint,
  }: Props = $props();

  const inputBorder = $derived(
    borderClass ??
      (error ? "border-2 border-red-500" : "border border-neutral-700"),
  );
</script>

<div class="mb-4 sm:mb-5">
  <label
    for={id}
    class="mb-1.5 block text-xs text-neutral-400 font-medium sm:text-sm"
  >
    {label}
    {#if badge}
      {@render badge()}
    {/if}
  </label>
  <input
    {id}
    type="text"
    bind:value
    {placeholder}
    {oninput}
    class="w-full rounded-md bg-pb-bg-surface px-3 py-2.5 text-sm text-neutral-100 outline-none placeholder:text-neutral-600 {inputBorder}"
  />
  {#if error}
    <p class="mt-1 text-xs text-red-400">{error}</p>
  {:else if hint}
    {@render hint()}
  {/if}
</div>
