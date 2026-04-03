<script lang="ts">
  import { goto } from "$app/navigation";
  import { authClient } from "$lib/auth-client";

  let { data } = $props();

  const signOut = async () => {
    await authClient.signOut();
    goto("/login");
  };
</script>

<main>
  <h1>Welcome, {data.user.name}</h1>
  <p>@{data.user.username}</p>
  <button onclick={signOut}>Sign out</button>
</main>
