<script lang="ts">
  import { Switch } from "bits-ui";

  type Props = {
    title: string;
    description?: string;
    checked: boolean;
  };

  let { title, description, checked = $bindable() }: Props = $props();
</script>

<div
  class="mb-6 flex items-center justify-between border border-neutral-700 rounded-md bg-neutral-900 p-3"
>
  <div class="mr-3 min-w-0">
    <p class="text-sm font-medium">{title}</p>
    {#if description}
      <p class="text-xs text-neutral-500">{description}</p>
    {/if}
  </div>
  <Switch.Root
    {checked}
    onCheckedChange={(v) => (checked = v)}
    class="h-5.5 w-10 inline-flex shrink-0 cursor-pointer items-center rounded-full transition-colors {checked
      ? 'bg-green-500'
      : 'bg-neutral-700'}"
  >
    <Switch.Thumb
      class="pointer-events-none block size-4.5 rounded-full bg-white shadow transition-transform {checked
        ? 'translate-x-[18px]'
        : 'translate-x-[2px]'}"
    />
  </Switch.Root>
</div>
