<script lang="ts">
  import type { Snippet } from "svelte";
  import * as m from "$lib/paraglide/messages";
  import UserAvatar from "./UserAvatar.svelte";
  import { formatMonthYear } from "$lib/utils/format-date";

  type Props = {
    image: string | null;
    name: string;
    username?: string | null;
    displayUsername?: string | null;
    createdAt: string | Date;
    footer?: Snippet;
  };

  let { image, name, username, displayUsername, createdAt, footer }: Props =
    $props();
</script>

<div class="mb-8 flex flex-col items-center text-center">
  <UserAvatar
    src={image}
    alt={name}
    lazy
    class="mb-3 size-20 sm:mb-4 sm:size-24"
  />
  <p class="text-xl font-bold sm:text-2xl">{name}</p>
  {#if username}
    <p class="mt-1 text-sm text-pb-text-muted">
      @{displayUsername ?? username}
    </p>
  {/if}
  <p class="mt-2 text-xs text-pb-text-muted">
    {m.profile_joined({ date: formatMonthYear(createdAt) })}
  </p>
  {#if footer}
    {@render footer()}
  {/if}
</div>
