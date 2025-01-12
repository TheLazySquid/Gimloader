<script lang="ts">
    import PluginManager from "$core/pluginManager/pluginManager.svelte";
    import LibManager from "$core/libManager/libManager.svelte";
    import Net from "$core/net/net";
    import { checkLibUpdate, checkPluginUpdate, checkScriptUpdate, compareVersions, scriptUrl } from "$core/net/checkUpdates";
    import { parseLibHeader, parsePluginHeader } from "$src/parseHeader";
    import showErrorMessage from "./showErrorMessage";
    import { Progressbar } from "flowbite-svelte";
    import Update from 'svelte-material-icons/Update.svelte';
    import { version } from "$src/consts.svelte";

    let showingProgress = $state(false);
    let completed = $state(0);
    let total = $state(0);

    async function checkAll() {
        if(!confirm("Do you want to try to update Gimloader, all plugins, and all libraries?")) return;
        showingProgress = true;

        let promises = [];
        for(let plugin of PluginManager.plugins) {
            if(!plugin.headers.downloadUrl) continue;
            promises.push(new Promise<void>(async (res, rej) => {
                let resp = await Net.corsRequest({ url: plugin.headers.downloadUrl })
                    .catch(() => rej(`Failed to update ${plugin.headers.name} from ${plugin.headers.downloadUrl}`));
                    
                if(!resp) return rej();
                completed = completed + 1;

                let headers = parsePluginHeader(resp.responseText);
                let comparison = compareVersions(plugin.headers.version ?? '', headers.version ?? '');

                if(comparison !== 'older') return res();

                plugin.edit(resp.responseText, headers);
            }))
        }

        for(let lib of LibManager.libs) {
            if(!lib.headers.downloadUrl) continue;
            promises.push(new Promise<void>(async (res, rej) => {
                let resp = await Net.corsRequest({ url: lib.headers.downloadUrl })
                    .catch(() => rej(`Failed to update ${lib.headers.name} from ${lib.headers.downloadUrl}`));
                    
                if(!resp) return rej();
                completed = completed + 1;

                let headers = parseLibHeader(resp.responseText);
                let comparison = compareVersions(lib.headers.version ?? '', headers.version ?? '');

                if(comparison !== 'older') return res();

                LibManager.editLib(lib, resp.responseText, headers);
            }))
        }

        promises.push(new Promise<void>(async (res, rej) => {
            let resp = await Net.corsRequest({ url: scriptUrl })
                .catch(() => rej(`Failed to update Gimloader from ${scriptUrl}`));
            if(!resp) return rej();

            completed = completed + 1;

            const versionPrefix = '// @version';
            let index = resp.responseText.indexOf(versionPrefix) + versionPrefix.length;
            let incomingVersion = resp.responseText.slice(index, resp.responseText.indexOf('\n', index)).trim();

            let comparison = compareVersions(version, incomingVersion);
            if(comparison !== 'older') return res();

            location.href = scriptUrl;
            res();
        }));

        total = promises.length;

        let results = await Promise.allSettled(promises);
        let failed = results.filter((r) => r.status === 'rejected') as PromiseRejectedResult[];

        if(failed.length > 0) {
            let msg = `Failed to update ${failed.length} items:\n`
                + failed.map((f) => f.reason).join('\n')
                + '\nDid you allow Gimloader to make Cross-Origin requests?';
            showErrorMessage(msg, "Some Updates Failed");
        }

        showingProgress = false;
    }
</script>

<div class="h-full overflow-y-auto">
    <div class="flex items-center">
        <button onclick={checkAll}>
            <Update size={25} />
        </button>
        Check all updates
    </div>
    {#if showingProgress}
        <Progressbar progress={completed / total * 100} labelInside />
    {/if}
    <h1 class="font-bold text-xl">Gimloader</h1>
    <div class="flex items-center">
        <button onclick={() => checkScriptUpdate(true)}>
            <Update size={25} />
        </button>
        Gimloader v{version}
    </div>
    <h1 class="font-bold text-xl">Plugins</h1>
    {#if PluginManager.plugins.length === 0}
        <h2 class="text-lg">No plugins installed</h2>
    {:else}
        {#each PluginManager.plugins as plugin}
            <div class="flex items-center">
                {#if plugin.headers.downloadUrl}
                    <button onclick={() => checkPluginUpdate(plugin)}>
                        <Update size={25} />
                    </button>
                {/if}
                {plugin.headers.name} {plugin.headers.version ? `v${plugin.headers.version}` : ''}
            </div>
        {/each}
    {/if}
    <h1 class="font-bold text-xl">Libraries</h1>
    {#if LibManager.libs.length === 0}
        <h2 class="text-lg">No libraries installed</h2>
    {:else}
        {#each LibManager.libs as lib}
            <div class="flex items-center">
                {#if lib.headers.downloadUrl}
                    <button onclick={() => checkLibUpdate(lib)}>
                        <Update size={25} />
                    </button>
                {/if}
                {lib.headers.name} {lib.headers.version ? `v${lib.headers.version}` : ''}
            </div>
        {/each}
    {/if}
</div>