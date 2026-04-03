<script lang="ts">
  import { page } from "$app/state";
  import { UserX } from "lucide-svelte";
</script>

<main class="mx-auto max-w-[480px] px-4 py-16 sm:px-6 sm:py-24">
  <div class="flex flex-col items-center text-center">
    <UserX class="mb-4 size-16 text-neutral-700" />
    <h1 class="text-2xl font-bold sm:text-3xl">{page.status}</h1>
    <p class="mt-2 text-sm text-neutral-500">
      {page.error?.message ?? "User not found"}
    </p>
    <a href="/" class="mt-6 text-sm text-green-400 hover:text-green-300">
      &larr; Go home
    </a>
  </div>
</main>
