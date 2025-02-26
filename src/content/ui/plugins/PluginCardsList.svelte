<script lang="ts">
    import { flip } from "svelte/animate";
    import { dndzone } from "svelte-dnd-action";
    import Plugin from "./Plugin.svelte";
    import { createPlugin } from "../editCodeModals.svelte";
    import { readUserFile } from "$content/utils";
    import { Button, Dropdown, DropdownItem } from "flowbite-svelte";
    import Search from '../components/Search.svelte';
    import PluginManager from "$core/pluginManager/pluginManager.svelte";
    import Storage from "$core/storage.svelte";
    import Port from "$shared/port.svelte";

    import PlusBoxOutline from 'svelte-material-icons/PlusBoxOutline.svelte';
    import Import from 'svelte-material-icons/Import.svelte';
    import ChevronDown from 'svelte-material-icons/ChevronDown.svelte';
    import ViewModule from 'svelte-material-icons/ViewModule.svelte';
    import ViewList from 'svelte-material-icons/ViewList.svelte';

    let { onDrop }: { onDrop: (callback: (text: string) => void) => void } = $props();

    onDrop((text: string) => {
        PluginManager.createPlugin(text);
    });
    
    const flipDurationMs = 300;
    let searchValue = $state("");
    let items = $state(PluginManager.plugins.map((plugin) => ({ id: plugin.headers.name })));

    $effect(() => {
        items = PluginManager.plugins
            .filter((plugin) => plugin.headers.name.toLowerCase().includes(searchValue.toLowerCase()))
            .map((plugin) => ({ id: plugin.headers.name }));
    });

    let dragDisabled = $state(true);

    function handleDndConsider(e: any) {
        items = e.detail.items;
    }

    function handleDndFinalize(e: any) {
        items = e.detail.items;
        dragDisabled = true;

        // Update the order of the plugins
        let order = items.map(i => i.id);
        PluginManager.arrangePlugins(order);
    }

    function startDrag() {
        dragDisabled = false;
    }

    function importPlugin() {
        readUserFile(".js")
            .then((code) => {
                code = code.replaceAll("\r\n", "\n");
                PluginManager.createPlugin(code);
            })
            .catch(() => {});
    }

    let sortOpen = $state(false);

    function sortEnabled() {
        sortOpen = false;
        let enabled = PluginManager.plugins.filter((p) => p.enabled);
        let disabled = PluginManager.plugins.filter((p) => !p.enabled);
        PluginManager.plugins = enabled.concat(disabled);
        Port.send("pluginsArrange", { order: PluginManager.plugins.map(p => p.headers.name) })
    }

    function sortAlphabetical() {
        sortOpen = false;
        let sorted = PluginManager.plugins.sort((a, b) => a.headers.name.localeCompare(b.headers.name));
        PluginManager.plugins = sorted;
        Port.send("pluginsArrange", { order: sorted.map(p => p.headers.name) });
    }

    let bulkOpen = $state(false);

    function deleteAll() {
        bulkOpen = false;

        if(PluginManager.plugins.length === 0) return;
        const conf = confirm("Are you sure you want to delete all plugins?");
        if (!conf) return;

        PluginManager.deleteAll();
    }

    function setView(mode: string) {
        Storage.updateSetting('menuView', mode);
    }
</script>

<div class="flex flex-col">
    <div class="flex items-center mb-[3px]">
        <button onclick={() => createPlugin()}>
            <PlusBoxOutline size={32} />
        </button>
        <button onclick={importPlugin}>
            <Import size={32} />
        </button>
        <Button class="h-7 mr-2">Bulk actions<ChevronDown class="ml-1" size={20} /></Button>
        <Dropdown bind:open={bulkOpen}>
            <DropdownItem on:click={deleteAll}>Delete all</DropdownItem>
            <DropdownItem on:click={() => PluginManager.setAll(true)}>Enable all</DropdownItem>
            <DropdownItem on:click={() => PluginManager.setAll(false)}>Disable all</DropdownItem>
        </Dropdown>
        <Button class="h-7">Sort by...<ChevronDown class="ml-1" size={20} /></Button>
        <Dropdown bind:open={sortOpen}>
            <DropdownItem on:click={sortEnabled}>Enabled</DropdownItem>
            <DropdownItem on:click={sortAlphabetical}>Alphabetical</DropdownItem>
        </Dropdown>
        <button class="w-[30px] h-7 flex items-center justify-center rounded-md ml-1" 
            class:bg-gray-200={Storage.settings.menuView == 'grid'}
            onclick={() => setView('grid')}>
            <ViewModule width={24} height={24} />
        </button>
        <button class="w-[30px] h-7 flex items-center justify-center rounded-md ml-1"
            class:bg-gray-200={Storage.settings.menuView == 'list'}
            onclick={() => setView('list')}>
            <ViewList width={24} height={24} />
        </button>
        <Search bind:value={searchValue} />
    </div>
    {#if PluginManager.plugins.length === 0}
        <h2 class="text-xl">No plugins installed! Import or create one to get started.</h2>
    {/if}
    <div class="max-h-full overflow-y-auto grid gap-4 pb-1 flex-grow plugins-{Storage.settings.menuView}"
    use:dndzone={{ items, flipDurationMs, dragDisabled, dropTargetStyle: {} }}
    onconsider={handleDndConsider} onfinalize={handleDndFinalize}>
        {#key searchValue}
            {#each items as item (item.id)}
                {@const plugin = PluginManager.getPlugin(item.id)}
                <div animate:flip={{ duration: flipDurationMs }}>
                    <Plugin {plugin} {startDrag} {dragDisabled}
                        view={Storage.settings.menuView} dragAllowed={searchValue == ""} />
                </div>
            {/each}
        {/key}
    </div>
</div>

<style>
    .plugins-grid {
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    }

    .plugins-list {
        grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
    }
</style>