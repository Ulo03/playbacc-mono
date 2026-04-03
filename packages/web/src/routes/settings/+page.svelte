<script lang="ts">
  import { invalidateAll } from "$app/navigation";
  import { Button, Switch } from "bits-ui";
  import { authClient } from "$lib/auth-client";
  import UserAvatar from "$lib/components/UserAvatar.svelte";
  import { UsernameSchema, NameSchema } from "@playbacc/shared";
  import * as v from "valibot";

  let { data } = $props();

  const API_URL = import.meta.env.PUBLIC_API_URL ?? "http://127.0.0.1:3000";

  // Form state
  let username = $state(data.user.displayUsername ?? data.user.username ?? "");
  let name = $state(data.user.name ?? "");
  let isPublic = $state(data.user.isPublic ?? false);

  // Track the saved username to detect changes
  const savedUsername = $derived(data.user.username);

  // Username validation state
  let usernameError = $state<string | null>(null);
  let usernameAvailable = $state<boolean | null>(null);
  let checkingUsername = $state(false);
  let debounceTimer: ReturnType<typeof setTimeout> | undefined;

  // Form state
  let saving = $state(false);
  let saveError = $state<string | null>(null);

  // Name validation
  let nameError = $state<string | null>(null);

  const validateName = (value: string) => {
    const result = v.safeParse(NameSchema, value);
    nameError = result.success
      ? null
      : (result.issues[0]?.message ?? "Invalid name");
  };

  const normalizedUsername = $derived(username.toLowerCase());
  const usernameUnchanged = $derived(normalizedUsername === savedUsername);

  const validateAndCheckUsername = (value: string) => {
    // Reset state
    usernameAvailable = null;
    usernameError = null;

    if (!value.trim()) {
      return;
    }

    // Client-side validation first
    const result = v.safeParse(UsernameSchema, value);
    if (!result.success) {
      usernameError = result.issues[0]?.message ?? "Invalid username";
      return;
    }

    // If unchanged from saved, don't check availability
    if (value.toLowerCase() === savedUsername) {
      return;
    }

    // Debounced availability check
    clearTimeout(debounceTimer);
    checkingUsername = true;
    debounceTimer = setTimeout(async () => {
      try {
        const res = await fetch(
          `${API_URL}/api/profile/check-username/${encodeURIComponent(value)}`,
          { credentials: "include" },
        );
        if (res.ok) {
          const data = await res.json();
          usernameAvailable = data.available;
          if (!data.available) {
            usernameError = "Username is already taken";
          }
        }
      } catch {
        // Fail silent — server validation catches it on save
      } finally {
        checkingUsername = false;
      }
    }, 300);
  };

  const handleSave = async () => {
    saveError = null;

    // Validate name
    const nameResult = v.safeParse(NameSchema, name);
    if (!nameResult.success) {
      nameError = nameResult.issues[0]?.message ?? "Invalid name";
      return;
    }

    // Validate username if present
    if (username.trim()) {
      const usernameResult = v.safeParse(UsernameSchema, username);
      if (!usernameResult.success) {
        usernameError = usernameResult.issues[0]?.message ?? "Invalid username";
        return;
      }
    }

    // Username is required if not yet set
    if (!savedUsername && !username.trim()) {
      usernameError = "Username is required";
      return;
    }

    saving = true;
    try {
      // Build update payload
      const updates: Record<string, unknown> = {};

      if (!usernameUnchanged && username.trim()) {
        updates.username = username;
      }
      if (name !== data.user.name) {
        updates.name = name;
      }
      if (isPublic !== (data.user.isPublic ?? false)) {
        updates.isPublic = isPublic;
      }

      if (Object.keys(updates).length > 0) {
        const { error } = await authClient.updateUser(updates);
        if (error) {
          if (error.message?.includes("username") || error.status === 409) {
            usernameError = "Username is already taken";
          } else {
            saveError = error.message ?? "Failed to save";
          }
          return;
        }
      }

      // Refresh server data
      await invalidateAll();

      // If this was the first username set, the page will now show the profile link
    } catch {
      saveError = "Something went wrong. Please try again.";
    } finally {
      saving = false;
    }
  };

  // Derived states for username field styling
  const usernameBorderClass = $derived(
    usernameError
      ? "border-2 border-red-500"
      : usernameAvailable === true
        ? "border-2 border-green-500"
        : "border border-neutral-700",
  );
</script>

<main class="mx-auto max-w-[480px] px-4 py-6 sm:px-6 sm:py-10">
  <!-- User header (read-only) -->
  <div class="mb-8 flex flex-col items-center text-center">
    <UserAvatar
      src={data.user.image}
      alt={data.user.name}
      class="mb-3 size-20 sm:mb-4 sm:size-24"
    />
    <p class="text-xl font-bold sm:text-2xl">{data.user.name}</p>
    {#if savedUsername}
      <p class="mt-1 text-sm text-neutral-500">
        @{data.user.displayUsername ?? savedUsername}
      </p>
    {/if}
    <p class="mt-1 text-xs text-neutral-600">{data.user.email}</p>
  </div>

  <!-- Username -->
  <div class="mb-4 sm:mb-5">
    <label
      for="username"
      class="mb-1.5 block text-xs text-neutral-400 font-medium sm:text-sm"
    >
      Username
      {#if !savedUsername}
        <span class="text-amber-500">*required</span>
      {/if}
    </label>
    <input
      id="username"
      type="text"
      bind:value={username}
      oninput={() => validateAndCheckUsername(username)}
      placeholder="Enter username"
      class="w-full rounded-md bg-neutral-900 px-3 py-2.5 text-sm text-neutral-100 outline-none placeholder:text-neutral-600 {usernameBorderClass}"
    />
    {#if usernameError}
      <p class="mt-1 text-xs text-red-400">{usernameError}</p>
    {:else if usernameAvailable === true}
      <p class="mt-1 text-xs text-green-400 font-medium">
        Username is available
      </p>
    {:else if checkingUsername}
      <p class="mt-1 text-xs text-neutral-500">Checking...</p>
    {:else if !usernameUnchanged || !savedUsername}
      <p class="mt-1 text-xs text-neutral-600">
        3-20 characters, letters, numbers, underscores
      </p>
    {/if}
  </div>

  <!-- Name -->
  <div class="mb-4 sm:mb-5">
    <label
      for="display-name"
      class="mb-1.5 block text-xs text-neutral-400 font-medium sm:text-sm"
    >
      Name
    </label>
    <input
      id="display-name"
      type="text"
      bind:value={name}
      oninput={() => validateName(name)}
      placeholder="Your display name"
      class="w-full border rounded-md bg-neutral-900 px-3 py-2.5 text-sm text-neutral-100 outline-none placeholder:text-neutral-600 {nameError
        ? 'border-2 border-red-500'
        : 'border-neutral-700'}"
    />
    {#if nameError}
      <p class="mt-1 text-xs text-red-400">{nameError}</p>
    {/if}
  </div>

  <!-- Public profile toggle -->
  <div
    class="mb-6 flex items-center justify-between border border-neutral-700 rounded-md bg-neutral-900 p-3"
  >
    <div class="mr-3 min-w-0">
      <p class="text-sm font-medium">Public Profile</p>
      <p class="text-xs text-neutral-500">Anyone can view your profile</p>
    </div>
    <Switch.Root
      checked={isPublic}
      onCheckedChange={(checked) => (isPublic = checked)}
      class="h-5.5 w-10 inline-flex shrink-0 cursor-pointer items-center rounded-full transition-colors {isPublic
        ? 'bg-green-500'
        : 'bg-neutral-700'}"
    >
      <Switch.Thumb
        class="pointer-events-none block size-4.5 rounded-full bg-white shadow transition-transform {isPublic
          ? 'translate-x-[18px]'
          : 'translate-x-[2px]'}"
      />
    </Switch.Root>
  </div>

  <hr class="my-6 border-neutral-800" />

  <!-- Profile link (only if username is saved) -->
  {#if savedUsername}
    <a
      href="/user/{savedUsername}"
      class="mb-4 block text-center text-sm text-green-400 hover:text-green-300"
    >
      View your profile &rarr;
    </a>
  {:else}
    <p class="mb-4 text-center text-xs text-neutral-600 italic">
      Set a username to view your profile
    </p>
  {/if}

  <!-- Save error -->
  {#if saveError}
    <p class="mb-3 text-center text-sm text-red-400">{saveError}</p>
  {/if}

  <!-- Save button -->
  <Button.Root
    onclick={handleSave}
    disabled={saving || !!usernameError || !!nameError}
    class="w-full rounded-md bg-green-500 px-4 py-3 text-sm text-black font-semibold transition-colors disabled:cursor-not-allowed hover:bg-green-400 disabled:opacity-50"
  >
    {saving ? "Saving..." : savedUsername ? "Save Changes" : "Save"}
  </Button.Root>
</main>
