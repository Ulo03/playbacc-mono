<script lang="ts">
  import * as m from "$lib/paraglide/messages";
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

<main class="min-h-screen flex items-center justify-center px-4 sm:px-6">
  <div class="max-w-96 w-full">
    <IconButton
      Icon={SpotifyIcon}
      onclick={signInWithSpotify}
      --btn-color="#1DB954"
    >
      {m.login_sign_in_spotify()}
    </IconButton>
  </div>
</main>
