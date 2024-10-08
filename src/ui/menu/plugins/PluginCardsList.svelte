<script lang="ts">
    import { flip } from "svelte/animate";
    import { dndzone } from "svelte-dnd-action";
    import PluginCard from "./PluginCard.svelte";
    import PluginManager from "../../../pluginManager/pluginManager";
    import { createPlugin } from "../../editCodeModals";
    import { readUserFile } from "../../../util";
    import { Button, Dropdown, DropdownItem } from "flowbite-svelte";
    import showErrorMessage from "../../showErrorMessage";
    import type { LibManagerType } from "../../../lib/libManager";

    import PlusBoxOutline from 'svelte-material-icons/PlusBoxOutline.svelte';
    import Import from 'svelte-material-icons/Import.svelte';
    import ChevronDown from 'svelte-material-icons/ChevronDown.svelte';

    const flipDurationMs = 300;

    export let pluginManager: PluginManager;
    export let libManager: LibManagerType;
    let { plugins: pluginsStore } = pluginManager;

    let items = $pluginsStore.map((plugin) => ({ id: plugin.headers.name }));
    $: items = $pluginsStore.map((plugin) => ({ id: plugin.headers.name }));

    let dragDisabled = true;

    function handleDndConsider(e: any) {
        items = e.detail.items;
    }

    function handleDndFinalize(e: any) {
        items = e.detail.items;
        dragDisabled = true;

        // Update the order of the plugins
        let newOrder = [];
        for (let item of items) {
            let plugin = $pluginsStore.find((p) => p.headers.name === item.id);
            if (plugin) newOrder.push(plugin);
        }
        pluginManager.plugins.set(newOrder);
        pluginManager.save();
    }

    function startDrag() {
        dragDisabled = false;
    }

    function importPlugin() {
        readUserFile(".js")
            .then((code) => {
                code = code.replaceAll("\r\n", "\n");
                pluginManager.createPlugin(code);
            })
            .catch(() => {});
    }

    let sortOpen = false;

    function sortEnabled() {
        sortOpen = false;
        let enabled = $pluginsStore.filter((p) => p.enabled);
        let disabled = $pluginsStore.filter((p) => !p.enabled);
        pluginManager.plugins.set(enabled.concat(disabled));
        pluginManager.save();
    }

    function sortAlphabetical() {
        sortOpen = false;
        let sorted = $pluginsStore.sort((a, b) => a.headers.name.localeCompare(b.headers.name));
        pluginManager.plugins.set(sorted);
        pluginManager.save();
    }

    let bulkOpen = false;

    function deleteAll() {
        bulkOpen = false;

        if($pluginsStore.length === 0) return;
        const conf = confirm("Are you sure you want to delete all plugins?");
        if (!conf) return;

        for(let plugin of $pluginsStore) {
            pluginManager.deletePlugin(plugin);
        }
    }

    async function setAll(enabled: boolean) {
        bulkOpen = false;

        if(!enabled) {
            for(let plugin of $pluginsStore) {
                if(plugin.enabled) plugin.disable();
            }

            pluginManager.save();
        } else {
            let toEnable = $pluginsStore.filter((p) => !p.enabled);
            let res = await Promise.allSettled(toEnable.map((p) => p.enable()));
            let errors = res.filter((r) => r.status === "rejected");

            pluginManager.save();
            if(errors.length === 0) return;
            let msg = errors.map((r) => r.reason.message).join("\n\n");
            showErrorMessage(msg, "Failed to enable some plugins");
        }
    }
</script>

<div class="flex flex-col">
    <div class="flex items-center mb-[3px]">
        <button on:click={() => createPlugin(pluginManager)}>
            <PlusBoxOutline size={32} />
        </button>
        <button on:click={importPlugin}>
            <Import size={32} />
        </button>
        <Button class="h-7 mr-2">Bulk actions<ChevronDown class="ml-1" size={20} /></Button>
        <Dropdown bind:open={bulkOpen}>
            <DropdownItem on:click={deleteAll}>Delete all</DropdownItem>
            <DropdownItem on:click={() => setAll(true)}>Enable all</DropdownItem>
            <DropdownItem on:click={() => setAll(false)}>Disable all</DropdownItem>
        </Dropdown>
        <Button class="h-7">Sort by...<ChevronDown class="ml-1" size={20} /></Button>
        <Dropdown bind:open={sortOpen}>
            <DropdownItem on:click={sortEnabled}>Enabled</DropdownItem>
            <DropdownItem on:click={sortAlphabetical}>Alphabetical</DropdownItem>
        </Dropdown>
    </div>
    {#if $pluginsStore.length === 0}
        <h2 class="text-xl">No plugins installed! Import or create one to get started.</h2>
    {/if}
    <div class="max-h-full overflow-y-auto grid gap-4 plugins pb-1 flex-grow"
    use:dndzone={{ items, flipDurationMs, dragDisabled, dropTargetStyle: {} }}
    on:consider={handleDndConsider} on:finalize={handleDndFinalize}>
        {#each items as item (item.id)}
            {@const plugin = pluginManager.getPlugin(item.id)}
            <div animate:flip={{ duration: flipDurationMs }}>
                <PluginCard {plugin} {startDrag} {dragDisabled} {pluginManager} {libManager} />
            </div>
        {/each}
    </div>
</div>

<style>
    .plugins {
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    }
</style>