<script lang="ts">
  import * as m from "$lib/paraglide/messages";

  let { data } = $props();
</script>

<main class="px-4 py-8 sm:px-6">
  <h1>{m.home_welcome({ name: data.user?.name ?? "" })}</h1>
</main>
