<script lang="ts">
  import { authClient } from "$lib/auth-client";

  const signInWithSpotify = async () => {
    await authClient.signIn.social({
      provider: "spotify",
      callbackURL: import.meta.env.PUBLIC_WEB_URL ?? "http://127.0.0.1:5173",
    });
  };
</script>

<main>
  <button onclick={signInWithSpotify}> Sign in with Spotify </button>
</main>
