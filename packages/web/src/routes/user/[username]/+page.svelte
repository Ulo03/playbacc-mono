<script lang="ts">
  import * as m from "$lib/paraglide/messages";
  import { Settings } from "lucide-svelte";
  import UserAvatar from "$lib/components/UserAvatar.svelte";
  import { formatMonthYear } from "$lib/utils/format-date";

  let { data } = $props();

  const profile = data.profile;
</script>

<main class="mx-auto max-w-[480px] px-4 py-8 sm:px-6 sm:py-12">
  <div class="flex flex-col items-center text-center">
    <UserAvatar
      src={profile.image}
      alt={profile.name}
      lazy
      class="mb-3 size-20 sm:mb-4 sm:size-24"
    />
    <h1 class="text-xl font-bold sm:text-2xl">{profile.name}</h1>
    <p class="mt-1 text-sm text-neutral-500">
      @{profile.displayUsername ?? profile.username}
    </p>
    <p class="mt-2 text-xs text-neutral-600">
      {m.profile_joined({ date: formatMonthYear(profile.createdAt) })}
    </p>

    {#if profile.isOwner}
      <a
        href="/settings"
        class="mt-3 inline-flex items-center gap-1.5 text-xs text-green-400 hover:text-green-300"
      >
        <Settings class="size-3.5" />
        {m.profile_settings()}
      </a>
    {/if}
  </div>

  <hr class="my-6 border-neutral-800 sm:my-8" />

  <p class="py-8 text-center text-sm text-neutral-600 italic sm:py-12">
    {m.profile_listening_history_empty()}
  </p>
</main>
