<script lang="ts">
  import "@unocss/reset/tailwind.css";
  import "virtual:uno.css";

  import { page } from "$app/state";
  import { locales, localizeHref } from "$lib/paraglide/runtime";
  import favicon from "$lib/assets/favicon.svg";
  import NavBar from "$lib/components/NavBar.svelte";

  let { data, children } = $props();

  const isLoginPage = $derived(page.url.pathname === "/login");
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<div class="min-h-screen bg-bg text-neutral-100">
  {#if data.user && !isLoginPage}
    <NavBar user={data.user} />
  {/if}
  {@render children()}
</div>

<div style="display: none">
  {#each locales as locale (locale)}
    <a href={localizeHref(page.url.pathname, { locale })}>{locale}</a>
  {/each}
</div>
