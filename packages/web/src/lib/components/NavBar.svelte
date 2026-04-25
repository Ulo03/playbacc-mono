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
  class="sticky top-0 z-50 w-full border-b border-pb-border bg-pb-bg/95 backdrop-blur-sm"
>
  <div class="flex items-center justify-between px-4 py-3 sm:px-6">
    <a
      href="/"
      class="text-base text-pb-text font-bold tracking-tight sm:text-lg"
    >
      playbacc
    </a>

    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        class="cursor-pointer rounded-full outline-none focus-visible:ring-2 focus-visible:ring-pb-focus-ring"
      >
        <UserAvatar src={user.image} alt={user.name} class="size-8 sm:size-9" />
      </DropdownMenu.Trigger>

      <DropdownMenu.Content
        align="end"
        sideOffset={8}
        class="z-50 min-w-[180px] border border-pb-border rounded-lg bg-pb-bg-surface shadow-xl"
      >
        <div class="border-b border-pb-border px-3 py-2.5">
          <p class="truncate text-sm text-pb-text font-semibold">
            {user.name}
          </p>
          {#if user.username}
            <p class="truncate text-xs text-pb-text-muted">
              @{user.displayUsername ?? user.username}
            </p>
          {/if}
        </div>

        {#if user.username}
          <DropdownMenu.Item
            class="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm text-pb-text-secondary outline-none focus:bg-pb-bg-surface-hover hover:bg-pb-bg-surface-hover"
            onSelect={() => goto(`/user/${user.username}`)}
          >
            <UserIcon class="size-3.5" />
            {m.nav_my_profile()}
          </DropdownMenu.Item>
        {/if}

        <DropdownMenu.Item
          class="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm text-pb-text-secondary outline-none focus:bg-pb-bg-surface-hover hover:bg-pb-bg-surface-hover"
          onSelect={() => goto("/settings")}
        >
          <Settings class="size-3.5" />
          {m.nav_settings()}
        </DropdownMenu.Item>

        <DropdownMenu.Separator class="my-1 h-px bg-pb-border" />

        <DropdownMenu.Item
          class="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm text-pb-danger outline-none focus:bg-pb-bg-surface-hover hover:bg-pb-bg-surface-hover"
          onSelect={signOut}
        >
          <LogOut class="size-3.5" />
          {m.nav_sign_out()}
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  </div>
</nav>
