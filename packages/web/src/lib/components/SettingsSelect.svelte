<script lang="ts">
  import { Select } from "bits-ui";
  import { ChevronDown } from "lucide-svelte";

  type Option = { value: string; label: string };

  type Props = {
    label: string;
    value: string;
    options: Option[];
  };

  let { label, value = $bindable(), options }: Props = $props();

  const selectedLabel = $derived(
    options.find((o) => o.value === value)?.label ?? "",
  );
</script>

<div class="mb-4 sm:mb-5">
  <p class="mb-1.5 text-xs text-neutral-400 font-medium sm:text-sm">
    {label}
  </p>
  <Select.Root type="single" bind:value>
    <Select.Trigger
      class="w-full flex items-center justify-between border border-neutral-700 rounded-md bg-bg-surface px-3 py-2.5 text-sm text-neutral-100 outline-none focus:border-primary"
    >
      {selectedLabel}
      <ChevronDown class="size-4 text-neutral-500" />
    </Select.Trigger>
    <Select.Portal>
      <Select.Content
        class="z-50 border border-neutral-700 rounded-md bg-bg-surface shadow-xl"
        sideOffset={4}
      >
        <Select.Viewport class="p-1">
          {#each options as opt (opt.value)}
            <Select.Item
              value={opt.value}
              class="cursor-pointer rounded px-3 py-2 text-sm text-neutral-300 outline-none data-[highlighted]:bg-neutral-800 data-[state=checked]:text-primary"
            >
              {#snippet children({ selected })}
                {selected ? "✓ " : ""}{opt.label}
              {/snippet}
            </Select.Item>
          {/each}
        </Select.Viewport>
      </Select.Content>
    </Select.Portal>
  </Select.Root>
</div>
