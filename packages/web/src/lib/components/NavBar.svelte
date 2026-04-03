<script lang="ts">
  import { goto } from "$app/navigation";
  import { DropdownMenu } from "bits-ui";
  import { authClient } from "$lib/auth-client";
  import UserAvatar from "./UserAvatar.svelte";
  import type { User } from "@playbacc/shared";

  type Props = {
    user: User;
  };

  let { user }: Props = $props();

  const signOut = async () => {
    await authClient.signOut();
    goto("/login");
  };
</script>

<nav
  class="sticky top-0 z-50 w-full border-b border-neutral-800 bg-neutral-950/95 backdrop-blur-sm"
>
  <div class="flex items-center justify-between px-4 py-3 sm:px-6">
    <a
      href="/"
      class="text-base text-neutral-100 font-bold tracking-tight sm:text-lg"
    >
      playbacc
    </a>

    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        class="cursor-pointer rounded-full outline-none focus-visible:ring-2 focus-visible:ring-green-500"
      >
        <UserAvatar src={user.image} alt={user.name} class="size-8 sm:size-9" />
      </DropdownMenu.Trigger>

      <DropdownMenu.Content
        align="end"
        sideOffset={8}
        class="z-50 min-w-[180px] border border-neutral-800 rounded-lg bg-neutral-900 shadow-xl"
      >
        <div class="border-b border-neutral-800 px-3 py-2.5">
          <p class="truncate text-sm text-neutral-100 font-semibold">
            {user.name}
          </p>
          {#if user.username}
            <p class="truncate text-xs text-neutral-500">
              @{user.displayUsername ?? user.username}
            </p>
          {/if}
        </div>

        {#if user.username}
          <DropdownMenu.Item
            class="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm text-neutral-300 outline-none focus:bg-neutral-800 hover:bg-neutral-800"
            onSelect={() => goto(`/user/${user.username}`)}
          >
            <svg
              class="size-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <circle cx="12" cy="8" r="4" /><path
                d="M5 20c0-4 3-7 7-7s7 3 7 7"
              />
            </svg>
            My Profile
          </DropdownMenu.Item>
        {/if}

        <DropdownMenu.Item
          class="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm text-neutral-300 outline-none focus:bg-neutral-800 hover:bg-neutral-800"
          onSelect={() => goto("/settings")}
        >
          <svg
            class="size-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <circle cx="12" cy="12" r="3" />
            <path
              d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
            />
          </svg>
          Settings
        </DropdownMenu.Item>

        <DropdownMenu.Separator class="my-1 h-px bg-neutral-800" />

        <DropdownMenu.Item
          class="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm text-red-400 outline-none focus:bg-neutral-800 hover:bg-neutral-800"
          onSelect={signOut}
        >
          <svg
            class="size-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Sign Out
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  </div>
</nav>
