<script lang="ts">
    import type Plugin from "$core/pluginManager/plugin.svelte";
    import PluginManager from "$core/pluginManager/pluginManager.svelte";
    import showErrorMessage from "../showErrorMessage";
    import { showPluginCodeEditor } from "../editCodeModals.svelte";
    import { checkPluginUpdate } from "$core/net/checkUpdates";
    import { Toggle, Modal } from "flowbite-svelte";
    import Card from "../components/Card.svelte";
    import Delete from "svelte-material-icons/Delete.svelte";
    import Pencil from "svelte-material-icons/Pencil.svelte";
    import BookSettings from "svelte-material-icons/BookSettings.svelte";
    import Update from "svelte-material-icons/Update.svelte";
    import Cog from "svelte-material-icons/Cog.svelte";
    import ScriptTextOutline from 'svelte-material-icons/ScriptTextOutline.svelte';
    import PluginLibrariesInfo from "./PluginLibrariesInfo.svelte";
    import ListItem from '../components/ListItem.svelte'

    let {
        startDrag,
        dragDisabled,
        plugin,
        view,
        dragAllowed
    }: Props = $props();

    function deletePlugin(plugin: Plugin) {
        let conf = confirm(`Are you sure you want to delete ${plugin.headers.name}?`);
        if(!conf) return;

        PluginManager.deletePlugin(plugin);
    }

    let loading = $state(false);

    async function toggleEnabled() {
        if(enabled) {
            plugin.disable();
            PluginManager.save();
        } else {
            let loadingTimeout = setTimeout(() => loading = true, 200);

            plugin.enable()
                .then(() => PluginManager.save())
                .catch((e) => {
                    if(!e?.message) return;
                    showErrorMessage(e.message, `Failed to enable plugin ${plugin.headers.name}`)
                })
                .finally(() => {
                    clearTimeout(loadingTimeout);
                    loading = false;
                });
        }
    }

    let libInfoOpen = $state(false);

    interface Props {
        startDrag: () => void;
        dragDisabled: boolean;
        plugin: Plugin;
        view: string;
        dragAllowed: boolean;
    }

    let enabled = $state(plugin?.enabled);
    $effect(() => {
        enabled = plugin?.enabled;
    });

    let component = $derived(view === 'grid' ? Card : ListItem);

    const SvelteComponent = $derived(component);
</script>

{#if libInfoOpen}
    <Modal size="lg" open outsideclose on:close={() => libInfoOpen = false}
        title={`Libraries used by ${plugin.headers.name}`}>
        <PluginLibrariesInfo {plugin} />
    </Modal>
{/if}

<SvelteComponent {dragDisabled} {startDrag} {loading} {dragAllowed}>
    {#snippet header()}
        <h2 class="overflow-ellipsis overflow-hidden whitespace-nowrap flex-grow text-xl font-bold">
            {plugin?.headers.name}
            {#if plugin?.headers.version}
                <span class="text-sm">v{plugin?.headers.version}</span>
            {/if}
        </h2>
    {/snippet}
    {#snippet toggle()}
        <button onclick={toggleEnabled}>
            <Toggle class="*:me-0" bind:checked={enabled} disabled></Toggle>
        </button>
    {/snippet}
    {#snippet author()}
        By {plugin?.headers.author}
    {/snippet}
    {#snippet description()}
        {plugin?.headers.description}
    {/snippet}
    {#snippet buttons()}
        <button onclick={() => deletePlugin(plugin)}>
            <Delete size={28} />
        </button>
        <button onclick={() => showPluginCodeEditor(plugin)}>
            <Pencil size={28} />
        </button>
        {#if plugin?.openSettingsMenu?.length != 0}
            <button onclick={() => plugin.openSettingsMenu.forEach(c => c())}>
                <Cog size={28} />
            </button>
        {:else if plugin?.headers.hasSettings !== "false"}
            <Cog size={28} class="opacity-50" title={plugin?.enabled ?
                "This plugin's settings menu is missing/invalid" :
                'Plugins need to be enabled to open settings'} />
        {/if}
        {#if plugin?.headers.downloadUrl}
            <button onclick={() => checkPluginUpdate(plugin)}>
                <Update size={28} />
            </button>
        {/if}
        {#if plugin?.headers.needsLib?.length || plugin?.headers.optionalLib?.length}
            <button onclick={() => libInfoOpen = true}>
                <BookSettings size={24} />
            </button>
        {/if}
        {#if plugin?.headers.webpage}
            <a href={plugin.headers.webpage} target="_blank">
                <ScriptTextOutline size={28} />
            </a>
        {/if}
    {/snippet}
</SvelteComponent>