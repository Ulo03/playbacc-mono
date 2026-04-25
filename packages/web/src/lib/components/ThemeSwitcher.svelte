<script lang="ts">
  import * as m from "$lib/paraglide/messages";
  import { Select } from "bits-ui";
  import { ChevronDown } from "lucide-svelte";
  import { authClient } from "$lib/auth-client";
  import { listThemes, getTheme, applyTheme } from "$lib/tokens";

  type Props = {
    value: string;
  };

  let { value = $bindable() }: Props = $props();

  const options = listThemes();
  const selectedLabel = $derived(
    options.find((o) => o.id === value)?.label ?? "",
  );

  const setCookie = (themeId: string) => {
    document.cookie = `pb-theme=${themeId};path=/;max-age=34560000;samesite=lax`;
  };

  const handleChange = async (next: string) => {
    const previous = value;
    if (next === previous) return;

    value = next;
    applyTheme(getTheme(next));
    setCookie(next);

    const { error } = await authClient.updateUser({ theme: next });
    if (error) {
      value = previous;
      applyTheme(getTheme(previous));
      setCookie(previous);
    }
  };
</script>

<div class="mb-4 sm:mb-5">
  <p class="mb-1.5 text-xs text-pb-text-secondary font-medium sm:text-sm">
    {m.settings_theme_label()}
  </p>
  <Select.Root type="single" {value} onValueChange={handleChange}>
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
          {#each options as opt (opt.id)}
            <Select.Item
              value={opt.id}
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
