<script lang="ts">
  import * as m from "$lib/paraglide/messages";
  import { Settings } from "lucide-svelte";
  import UserHeader from "$lib/components/UserHeader.svelte";

  let { data } = $props();

  const profile = data.profile;
</script>

<main class="mx-auto max-w-[480px] px-4 py-8 sm:px-6 sm:py-12">
  <UserHeader
    image={profile.image}
    name={profile.name}
    username={profile.username}
    displayUsername={profile.displayUsername}
    createdAt={profile.createdAt}
  >
    {#snippet footer()}
      {#if profile.isOwner}
        <a
          href="/settings"
          class="mt-3 inline-flex items-center gap-1.5 text-xs text-primary hover:text-primary-light"
        >
          <Settings class="size-3.5" />
          {m.profile_settings()}
        </a>
      {/if}
    {/snippet}
  </UserHeader>

  <hr class="my-6 border-neutral-800 sm:my-8" />

  <p class="py-8 text-center text-sm text-neutral-600 italic sm:py-12">
    {m.profile_listening_history_empty()}
  </p>
</main>
