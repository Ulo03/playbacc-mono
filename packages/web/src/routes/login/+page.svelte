<script lang="ts">
  import { authClient } from "$lib/auth-client";
  import IconButton from "$lib/components/IconButton.svelte";
  import SpotifyIcon from "$lib/assets/icons/SpotifyIcon.svelte";

  const signInWithSpotify = async () => {
    await authClient.signIn.social({
      provider: "spotify",
      callbackURL: import.meta.env.PUBLIC_WEB_URL ?? "http://127.0.0.1:5173",
    });
  };
</script>

<main class="min-h-screen flex items-center justify-center">
  <div class="w-96">
    <IconButton
      Icon={SpotifyIcon}
      onclick={signInWithSpotify}
      --btn-color="#1db954"
    >
      Sign in with Spotify
    </IconButton>
  </div>
</main>
