<script lang="ts">
  import UserAvatar from "$lib/components/UserAvatar.svelte";

  let { data } = $props();

  const profile = data.profile;

  const joinedDate = new Date(profile.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
</script>

<main class="mx-auto max-w-[480px] px-4 py-8 sm:px-6 sm:py-12">
  <div class="flex flex-col items-center text-center">
    <UserAvatar
      src={profile.image}
      alt={profile.name}
      class="mb-3 size-20 sm:mb-4 sm:size-24"
    />
    <h1 class="text-xl font-bold sm:text-2xl">{profile.name}</h1>
    <p class="mt-1 text-sm text-neutral-500">
      @{profile.displayUsername ?? profile.username}
    </p>
    <p class="mt-2 text-xs text-neutral-600">Joined {joinedDate}</p>

    {#if profile.isOwner}
      <a
        href="/settings"
        class="mt-3 inline-flex items-center gap-1 text-xs text-green-400 hover:text-green-300"
      >
        <svg
          class="size-3.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
          />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
        Edit settings
      </a>
    {/if}
  </div>

  <hr class="my-6 border-neutral-800 sm:my-8" />

  <p class="py-8 text-center text-sm text-neutral-600 italic sm:py-12">
    Listening history will appear here
  </p>
</main>
