<script lang="ts">
  import * as m from "$lib/paraglide/messages";
  import { invalidateAll } from "$app/navigation";
  import { Button } from "bits-ui";
  import { authClient } from "$lib/auth-client";
  import {
    UsernameSchema,
    NameSchema,
    SUPPORTED_TIME_FORMATS,
  } from "@playbacc/shared";
  import * as v from "valibot";
  import UserHeader from "$lib/components/UserHeader.svelte";
  import FormField from "$lib/components/FormField.svelte";
  import ToggleCard from "$lib/components/ToggleCard.svelte";
  import SettingsSelect from "$lib/components/SettingsSelect.svelte";
  import SettingsRadioGroup from "$lib/components/SettingsRadioGroup.svelte";

  let { data } = $props();

  const API_URL = import.meta.env.PUBLIC_API_URL ?? "http://127.0.0.1:3000";

  const LOCALE_OPTIONS = [
    { value: "en", label: "English" },
    { value: "de", label: "Deutsch" },
  ];

  const timeFormatOptions = $derived(
    SUPPORTED_TIME_FORMATS.map((fmt) => ({
      value: fmt,
      label:
        fmt === "12h"
          ? m.settings_time_format_12h()
          : m.settings_time_format_24h(),
    })),
  );

  // Form state
  let username = $state(data.user.displayUsername ?? data.user.username ?? "");
  let name = $state(data.user.name ?? "");
  let isPublic = $state(data.user.isPublic ?? false);
  let locale = $state(data.user.locale);
  let timeFormat = $state(data.user.timeFormat);

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
    usernameAvailable = null;
    usernameError = null;

    if (!value.trim()) {
      return;
    }

    const result = v.safeParse(UsernameSchema, value);
    if (!result.success) {
      usernameError = result.issues[0]?.message ?? "Invalid username";
      return;
    }

    if (value.toLowerCase() === savedUsername) {
      return;
    }

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
            usernameError = m.settings_username_taken();
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

    const nameResult = v.safeParse(NameSchema, name);
    if (!nameResult.success) {
      nameError = nameResult.issues[0]?.message ?? "Invalid name";
      return;
    }

    if (username.trim()) {
      const usernameResult = v.safeParse(UsernameSchema, username);
      if (!usernameResult.success) {
        usernameError = usernameResult.issues[0]?.message ?? "Invalid username";
        return;
      }
    }

    if (!savedUsername && !username.trim()) {
      usernameError = m.settings_username_required_error();
      return;
    }

    saving = true;
    try {
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
      if (locale !== data.user.locale) {
        updates.locale = locale;
      }
      if (timeFormat !== data.user.timeFormat) {
        updates.timeFormat = timeFormat;
      }

      if (Object.keys(updates).length > 0) {
        const { error } = await authClient.updateUser(updates);
        if (error) {
          if (error.message?.includes("username") || error.status === 409) {
            usernameError = m.settings_username_taken();
          } else {
            saveError = error.message ?? "Failed to save";
          }
          return;
        }
      }

      if (updates.locale) {
        document.cookie = `PARAGLIDE_LOCALE=${updates.locale};path=/;max-age=34560000;samesite=lax`;
      }

      await invalidateAll();

      usernameError = null;
      usernameAvailable = null;
      nameError = null;
      saveError = null;
    } catch {
      saveError = m.settings_save_error();
    } finally {
      saving = false;
    }
  };

  const hasChanges = $derived(
    (!usernameUnchanged && username.trim() !== "") ||
      name !== (data.user.name ?? "") ||
      isPublic !== (data.user.isPublic ?? false) ||
      locale !== data.user.locale ||
      timeFormat !== data.user.timeFormat ||
      (!savedUsername && username.trim() !== ""),
  );

  const usernameBorderClass = $derived(
    usernameError
      ? "border-2 border-red-500"
      : usernameAvailable === true
        ? "border-2 border-pb-primary"
        : "border border-neutral-700",
  );
</script>

<main class="mx-auto max-w-[480px] px-4 py-6 sm:px-6 sm:py-10">
  <UserHeader
    image={data.user.image}
    name={data.user.name}
    username={savedUsername}
    displayUsername={data.user.displayUsername}
    createdAt={data.user.createdAt}
  />

  <FormField
    id="username"
    label={m.settings_username_label()}
    bind:value={username}
    placeholder={m.settings_username_placeholder()}
    error={usernameError}
    borderClass={usernameBorderClass}
    oninput={() => validateAndCheckUsername(username)}
  >
    {#snippet badge()}
      {#if !savedUsername}
        <span class="text-amber-500">{m.settings_username_required()}</span>
      {/if}
    {/snippet}
    {#snippet hint()}
      {#if usernameAvailable === true}
        <p class="mt-1 text-xs text-pb-primary font-medium">
          {m.settings_username_available()}
        </p>
      {:else if checkingUsername}
        <p class="mt-1 text-xs text-neutral-500">
          {m.settings_username_checking()}
        </p>
      {:else if !usernameUnchanged || !savedUsername}
        <p class="mt-1 text-xs text-neutral-600">
          {m.settings_username_help()}
        </p>
      {/if}
    {/snippet}
  </FormField>

  <FormField
    id="display-name"
    label={m.settings_name_label()}
    bind:value={name}
    placeholder={m.settings_name_placeholder()}
    error={nameError}
    oninput={() => validateName(name)}
  />

  <ToggleCard
    title={m.settings_public_profile()}
    description={m.settings_public_profile_description()}
    bind:checked={isPublic}
  />

  <hr class="my-6 border-neutral-800" />

  <h2 class="mb-4 text-sm text-neutral-400 font-medium sm:text-base">
    {m.settings_preferences_heading()}
  </h2>

  <SettingsSelect
    label={m.settings_language_label()}
    bind:value={locale}
    options={LOCALE_OPTIONS}
  />

  <SettingsRadioGroup
    label={m.settings_time_format_label()}
    bind:value={timeFormat}
    options={timeFormatOptions}
  />

  <hr class="my-6 border-neutral-800" />

  {#if savedUsername}
    <a
      href="/user/{savedUsername}"
      class="mb-4 block text-center text-sm text-pb-primary hover:text-pb-primary-light"
    >
      {m.settings_view_profile()}
    </a>
  {:else}
    <p class="mb-4 text-center text-xs text-neutral-600 italic">
      {m.settings_set_username_hint()}
    </p>
  {/if}

  {#if saveError}
    <p class="mb-3 text-center text-sm text-red-400">{saveError}</p>
  {/if}

  <Button.Root
    onclick={handleSave}
    disabled={saving || !!usernameError || !!nameError || !hasChanges}
    class="w-full rounded-md bg-pb-primary px-4 py-3 text-sm text-black font-semibold transition-colors disabled:cursor-not-allowed hover:bg-pb-primary-light disabled:opacity-50"
  >
    {saving
      ? m.settings_saving()
      : savedUsername
        ? m.settings_save_changes()
        : m.settings_save()}
  </Button.Root>
</main>
