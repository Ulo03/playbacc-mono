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
  <p class="mb-1.5 text-xs text-pb-text-secondary font-medium sm:text-sm">
    {label}
  </p>
  <Select.Root type="single" bind:value>
    <Select.Trigger
      class="w-full flex items-center justify-between border border-pb-border rounded-md bg-pb-bg-surface px-3 py-2.5 text-sm text-pb-text outline-none focus:border-pb-primary"
    >
      {selectedLabel}
      <ChevronDown class="size-4 text-pb-text-muted" />
    </Select.Trigger>
    <Select.Portal>
      <Select.Content
        class="z-50 border border-pb-border rounded-md bg-pb-bg-surface shadow-xl"
        sideOffset={4}
      >
        <Select.Viewport class="p-1">
          {#each options as opt (opt.value)}
            <Select.Item
              value={opt.value}
              class="cursor-pointer rounded px-3 py-2 text-sm text-pb-text-secondary outline-none data-[highlighted]:bg-pb-bg-surface-hover data-[state=checked]:text-pb-primary"
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
