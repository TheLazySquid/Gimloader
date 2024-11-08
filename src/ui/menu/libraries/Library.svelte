<script lang="ts">
    import Card from "../components/Card.svelte";
    import type Lib from "../../../lib/lib";
    import type { LibManagerType } from "../../../lib/libManager";

    import Delete from "svelte-material-icons/Delete.svelte";
    import Pencil from "svelte-material-icons/Pencil.svelte";
    import Update from "svelte-material-icons/Update.svelte";
    import { showLibCodeEditor } from "../../editCodeModals";
    import { checkLibUpdate } from "../../../net/checkUpdates";
    import ListItem from "../components/ListItem.svelte";

    export let startDrag: () => void;
    export let dragDisabled: boolean;
    export let library: Lib;
    export let libManager: LibManagerType;
    export let view: string;

    function deleteLib() {
        let conf = confirm(`Are you sure you want to delete ${library.headers.name}?`);
        if(!conf) return;

        libManager.deleteLib(library);
    }

    $: component = view === 'grid' ? Card : ListItem;
</script>

<svelte:component this={component} {dragDisabled} {startDrag}>
    <svelte:fragment slot="header">
        <h2 class="overflow-ellipsis overflow-hidden whitespace-nowrap flex-grow text-xl font-bold">
            {library?.headers.name}
            {#if library?.headers.version}
                <span class="text-sm">v{library?.headers.version}</span>
            {/if}
        </h2>
    </svelte:fragment>
    <svelte:fragment slot="author">
        By {library?.headers.author}
    </svelte:fragment>
    <svelte:fragment slot="description">
        {library?.headers.description}
    </svelte:fragment>
    <svelte:fragment slot="buttons">
        <button on:click={deleteLib}>
            <Delete size={28} />
        </button>
        <button on:click={() => showLibCodeEditor(library, libManager)}>
            <Pencil size={28} />
        </button>
        {#if library?.headers.downloadUrl}
            <button on:click={() => checkLibUpdate(library)}>
                <Update size={28} />
            </button>
        {/if}
    </svelte:fragment>
</svelte:component>