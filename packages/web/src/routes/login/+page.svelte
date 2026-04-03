<script lang="ts">
  import { authClient } from "$lib/auth-client";

  const signInWithSpotify = async () => {
    const { data, error } = await authClient.signIn.social({
      provider: "spotify",
      callbackURL: import.meta.env.PUBLIC_WEB_URL ?? "http://127.0.0.1:5173",
    });
    if (error) {
      console.error("Sign-in error:", error);
      return;
    }
    if (data?.url) {
      window.location.href = data.url;
    }
  };
</script>

<main>
  <h1>Playbacc</h1>
  <p>Sign in to track your listening history.</p>
  <button onclick={signInWithSpotify}> Sign in with Spotify </button>
</main>
