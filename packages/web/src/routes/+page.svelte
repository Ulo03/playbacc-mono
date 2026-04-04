<script lang="ts">
  let { data } = $props();
</script>

<main class="px-4 py-8 sm:px-6">
  <h1>Welcome, {data.user?.name}</h1>
</main>
