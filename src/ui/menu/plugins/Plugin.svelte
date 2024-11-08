<script lang="ts">
    import type Plugin from "../../../pluginManager/plugin";
    import type PluginManager from "../../../pluginManager/pluginManager";
    import showErrorMessage from "../../showErrorMessage";
    import { showPluginCodeEditor } from "../../editCodeModals";
    import { checkPluginUpdate } from "../../../net/checkUpdates";
    import { Toggle, Modal } from "flowbite-svelte";
    import type { LibManagerType } from "../../../lib/libManager";

    import Card from "../components/Card.svelte";
    import Delete from "svelte-material-icons/Delete.svelte";
    import Pencil from "svelte-material-icons/Pencil.svelte";
    import BookSettings from "svelte-material-icons/BookSettings.svelte";
    import Update from "svelte-material-icons/Update.svelte";
    import Cog from "svelte-material-icons/Cog.svelte";
    import PluginLibrariesInfo from "./PluginLibrariesInfo.svelte";
    import ListItem from '../components/ListItem.svelte'

    export let startDrag: () => void;
    export let dragDisabled: boolean;
    export let pluginManager: PluginManager;
    export let libManager: LibManagerType;
    export let plugin: Plugin;
    export let view: string;

    let { plugins: pluginsStore } = pluginManager;

    function deletePlugin(plugin: Plugin) {
        let conf = confirm(`Are you sure you want to delete ${plugin.headers.name}?`);
        if(!conf) return;

        pluginManager.deletePlugin(plugin);
    }

    $: enabled = plugin?.enabled;
    let loading = false;

    async function toggleEnabled() {
        if(enabled) {
            plugin.disable();
            pluginManager.save();
        } else {
            let loadingTimeout = setTimeout(() => loading = true, 200);

            plugin.enable()
                .then(() => pluginManager.save())
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

    let libInfoOpen = false;

    $: component = view === 'grid' ? Card : ListItem;

    export let dragAllowed: boolean;
</script>

{#if libInfoOpen}
    <Modal size="lg" open outsideclose on:close={() => libInfoOpen = false}
        title={`Libraries used by ${plugin.headers.name}`}>
        <PluginLibrariesInfo {plugin} {libManager} />
    </Modal>
{/if}

<svelte:component this={component} {dragDisabled} {startDrag} {loading} {dragAllowed}>
    <svelte:fragment slot="header">
        <h2 class="overflow-ellipsis overflow-hidden whitespace-nowrap flex-grow text-xl font-bold">
            {plugin?.headers.name}
            {#if plugin?.headers.version}
                <span class="text-sm">v{plugin?.headers.version}</span>
            {/if}
        </h2>
    </svelte:fragment>
    <svelte:fragment slot="toggle">
        <button on:click={toggleEnabled}>
            <Toggle class="*:me-0" bind:checked={enabled} disabled></Toggle>
        </button>
    </svelte:fragment>
    <svelte:fragment slot="author">
        By {plugin?.headers.author}
    </svelte:fragment>
    <svelte:fragment slot="description">
        {plugin?.headers.description}
    </svelte:fragment>
    <svelte:fragment slot="buttons">
        <button on:click={() => deletePlugin(plugin)}>
            <Delete size={28} />
        </button>
        <button on:click={() => showPluginCodeEditor($pluginsStore, plugin, pluginManager)}>
            <Pencil size={28} />
        </button>
        {#if plugin?.return?.openSettingsMenu}
            <button on:click={() => plugin.return.openSettingsMenu()}>
                <Cog size={28} />
            </button>
        {/if}
        {#if plugin?.headers.downloadUrl}
            <button on:click={() => checkPluginUpdate(plugin)}>
                <Update size={28} />
            </button>
        {/if}
        {#if plugin?.headers.needsLib?.length || plugin?.headers.optionalLib?.length}
            <button on:click={() => libInfoOpen = true}>
                <BookSettings size={24} />
            </button>
        {/if}
    </svelte:fragment>
</svelte:component>