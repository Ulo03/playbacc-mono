<script lang="ts">
  let { data } = $props();
</script>

<main>
  <h1>Welcome, {data.user.name}</h1>
  <p>@{data.user.username}</p>
</main>
