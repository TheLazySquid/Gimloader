<script lang="ts">
    import PluginManager from "$core/pluginManager/pluginManager.svelte";
    import LibManager from "$core/libManager/libManager.svelte";
    import { checkLibUpdate, checkPluginUpdate } from "$core/net/checkUpdates";
    import Update from 'svelte-material-icons/Update.svelte';
    import { version } from "../../../package.json";
    import toast from "svelte-5-french-toast";
    import Port from "$shared/port.svelte";

    async function checkAll() {
        if(!confirm("Do you want to try to update all plugins and all libraries?")) return;
        let names: string[] = await Port.sendAndRecieve("updateAll");
        
        let namesFmt: string;
        if(names.length === 0) return toast.success("All scripts are up to date!");
        else if(names.length === 1) namesFmt = names[0];
        else if(names.length === 2) namesFmt = `${names[0]} and ${names[1]}`;
        else namesFmt = `${names.slice(0, -1).join(", ")}, and ${names.at(-1)}`; 
        toast.success(`Updated ${namesFmt}`);
    }
</script>

<div class="h-full overflow-y-auto">
    <div class="flex names-center">
        <button onclick={checkAll}>
            <Update size={25} />
        </button>
        Check all updates
    </div>
    <h1 class="font-bold text-xl">Gimloader</h1>
    <div class="flex items-center">
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