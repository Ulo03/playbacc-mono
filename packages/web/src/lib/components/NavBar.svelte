<script lang="ts">
  import * as m from "$lib/paraglide/messages";
  import { goto } from "$app/navigation";
  import { DropdownMenu } from "bits-ui";
  import { User as UserIcon, Settings, LogOut } from "lucide-svelte";
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
            <UserIcon class="size-3.5" />
            {m.nav_my_profile()}
          </DropdownMenu.Item>
        {/if}

        <DropdownMenu.Item
          class="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm text-neutral-300 outline-none focus:bg-neutral-800 hover:bg-neutral-800"
          onSelect={() => goto("/settings")}
        >
          <Settings class="size-3.5" />
          {m.nav_settings()}
        </DropdownMenu.Item>

        <DropdownMenu.Separator class="my-1 h-px bg-neutral-800" />

        <DropdownMenu.Item
          class="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm text-red-400 outline-none focus:bg-neutral-800 hover:bg-neutral-800"
          onSelect={signOut}
        >
          <LogOut class="size-3.5" />
          {m.nav_sign_out()}
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  </div>
</nav>
