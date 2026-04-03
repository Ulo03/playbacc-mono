<script lang="ts">
  import { authClient } from "$lib/auth-client";

  const signInWithSpotify = () => {
    authClient.signIn.social({
      provider: "spotify",
      callbackURL: "/",
    });
  };
</script>

<main>
  <h1>Playbacc</h1>
  <p>Sign in to track your listening history.</p>
  <button onclick={signInWithSpotify}> Sign in with Spotify </button>
</main>
