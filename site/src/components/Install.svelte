<script lang="ts">
    import Highlight from 'svelte-highlight';
    import javascript from 'svelte-highlight/languages/javascript';
    import diffLang from 'svelte-highlight/languages/diff';
    import { createTwoFilesPatch } from 'diff';
    import onedark from 'svelte-highlight/styles/onedark';
    import parseHeader from '../lib/parseHeader';
    import { onMount } from 'svelte';

    const searchParams = new URLSearchParams(window.location.search);
    const installUrl = searchParams.get('installUrl');

    let GLInstallMissing = $state(false);
    let mode: 'install' | 'update' | 'allSet' = $state('install');
    let diffedScript = $state('');

    onMount(() => {
        if(document.readyState === "complete") {
            GLInstallMissing = (window as any).GLInstall === undefined;
        } else {
            window.addEventListener("load", () => {
                GLInstallMissing = (window as any).GLInstall === undefined;
            });
        }
    });

    async function fetchScript() {
        if(GLInstallMissing) throw new Error('Gimloader not found');
        if(!installUrl) throw new Error('No install URL provided');

        const res = await fetch(installUrl);
        if(!res.ok) throw new Error(`Failed to fetch script: ${res.status}`);

        const script = await res.text();
        const header = parseHeader(script);

        let existing = (window as any).GLGet?.(header.name);

        if(existing) {
            if(existing === script) {
                mode = 'allSet';
                document.title = `${header.name} - Gimloader`
                return { script, header };
            }

            mode = 'update';
            document.title = `Update ${header.name} - Gimloader`

            diffedScript = createTwoFilesPatch(
                `${header.name} (old)`,
                `${header.name} (new)`,
                existing,
                script
            );
        } else {
            document.title = `Install ${header.name} - Gimloader`
        }

        return { script, header };
    }

    let installComplete = $state(false);

    function installScript(script: string) {
        if(GLInstallMissing) return;

        (window as any).GLInstall(script);
        installComplete = true;
    }
</script>

<svelte:head>
    {@html onedark}
</svelte:head>

<div class="flex justify-center max-h-screen">
    <div class="p-5 max-h-full" style="max-width: min(90%, max(900px, 50%))">
        <div class="bg-primary-foreground drop-shadow-lg rounded-lg p-5 h-full">
            {#if installComplete}
                <h1 class="w-full text-center font-bold text-5xl">
                    {#if mode === 'update'}
                        Updated Successfully
                    {:else}
                        Installed Successfully
                    {/if}
                </h1>
                <p>You may now close this page.</p>
            {:else}
                {#if installUrl}
                    {#if !GLInstallMissing}
                        {#await fetchScript()}
                            <p>Loading script...</p>
                        {:then { script, header }}
                            <div class="flex flex-col h-full">
                                <h1 class="w-full text-center font-bold text-5xl">
                                    {header.name}
                                    {#if header.version}
                                        <span class="text-xl font-normal">v{header.version}</span>
                                    {/if}
                                </h1>
                                <h2 class="text-3xl w-full text-center">
                                    By {header.author}
                                </h2>
                                <p class="w-full text-center">
                                    {header.description}
                                </p>
                                {#if mode === 'allSet'}
                                    <div class="border border-black p-3">
                                        <p class="text-4xl w-full text-center font-bold">This plugin is up to date!</p>
                                        <p class="text-3xl w-full text-center">You may now close this page.</p>
                                    </div>
                                {:else}
                                    <div class="overflow-y-auto mt-3 rounded-md">
                                        {#if mode === 'update'}
                                            <Highlight language={diffLang} code={diffedScript} />
                                        {:else}
                                            <Highlight language={javascript} code={script} />
                                        {/if}
                                    </div>
                                    <button onclick={() => installScript(script)}
                                    class="bg-green-700 rounded-full mt-3 p-1">
                                        {#if mode === 'update'}
                                            Update
                                        {:else}
                                            Install
                                        {/if}
                                    </button>
                                {/if}
                            </div>
                        {:catch error}
                            <h1 class="text-5xl font-bold w-full text-center">
                                Error Loading Script
                            </h1>
                            <p class="pt-3 text-xl">
                                {error.message}
                            </p>
                        {/await}
                    {:else}
                        <h1 class="text-5xl font-bold w-full text-center">
                            Gimloader Not Found
                        </h1>
                        <p>
                            Follow the instructions
                            <a href="/Gimloader/usage/installation"
                            class="underline text-blue-600" rel="noopener noreferrer">
                                here
                            </a>
                            to install it. If you already have Gimloader installed, follow the instructions
                            <a href="/Gimloader/usage/updating"
                            class="underline text-blue-600" rel="noopener noreferrer">
                                here
                            </a>
                            to update it.
                        </p>
                    {/if}
                {:else}
                    <h1 class="text-5xl font-bold w-full text-center">
                        Invalid Install Link
                    </h1>
                    <p class="pt-3 text-xl">
                        This page is for installing Gimloader plugins from a link.
                        If you don't have a link to a plugin, there is nothing to do here.
                        <a class="underline cursor-pointer" href="/Gimloader">Go home?</a>
                    </p>
                {/if}
            {/if}
        </div>
    </div>
</div>