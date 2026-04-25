<script lang="ts">
  import { RadioGroup, Label } from "bits-ui";

  type Option = { value: string; label: string };

  type Props = {
    label: string;
    value: string;
    options: Option[];
  };

  let { label, value = $bindable(), options }: Props = $props();
</script>

<div class="mb-6">
  <p class="mb-1.5 text-xs text-pb-text-secondary font-medium sm:text-sm">
    {label}
  </p>
  <RadioGroup.Root bind:value class="flex flex-col gap-2">
    {#each options as opt (opt.value)}
      {@const id = `radio-${opt.value}`}
      <div class="flex items-center gap-2.5">
        <RadioGroup.Item
          {id}
          value={opt.value}
          class="size-4.5 shrink-0 border rounded-full {value === opt.value
            ? 'border-pb-primary'
            : 'border-pb-border'}"
        >
          {#snippet children({ checked })}
            {#if checked}
              <div class="m-auto size-2.5 rounded-full bg-pb-primary"></div>
            {/if}
          {/snippet}
        </RadioGroup.Item>
        <Label.Root
          for={id}
          class="cursor-pointer text-sm text-pb-text-secondary"
        >
          {opt.label}
        </Label.Root>
      </div>
    {/each}
  </RadioGroup.Root>
</div>
