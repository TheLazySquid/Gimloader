<script lang="ts">
    import Card from "../components/Card.svelte";
    import type Lib from "../../../lib/lib";
    import type { LibManagerType } from "../../../lib/libManager.svelte";

    import Delete from "svelte-material-icons/Delete.svelte";
    import Pencil from "svelte-material-icons/Pencil.svelte";
    import Update from "svelte-material-icons/Update.svelte";
    import { showLibCodeEditor } from "../../editCodeModals.svelte";
    import { checkLibUpdate } from "../../../net/checkUpdates";
    import ListItem from "../components/ListItem.svelte";

    function deleteLib() {
        let conf = confirm(`Are you sure you want to delete ${library.headers.name}?`);
        if(!conf) return;

        libManager.deleteLib(library);
    }

    interface Props {
        startDrag: () => void;
        dragDisabled: boolean;
        library: Lib;
        libManager: LibManagerType;
        view: string;
        dragAllowed: boolean;
    }

    let {
        startDrag,
        dragDisabled,
        library,
        libManager,
        view,
        dragAllowed
    }: Props = $props();
    let component = $derived(view === 'grid' ? Card : ListItem);

    const SvelteComponent = $derived(component);
</script>

<SvelteComponent {dragDisabled} {startDrag} {dragAllowed}>
    {#snippet header()}
        <h2 class="overflow-ellipsis overflow-hidden whitespace-nowrap flex-grow text-xl font-bold">
            {library?.headers.name}
            {#if library?.headers.version}
                <span class="text-sm">v{library?.headers.version}</span>
            {/if}
        </h2>
    {/snippet}
    {#snippet author()}
        By {library?.headers.author}
    {/snippet}
    {#snippet description()}
        {library?.headers.description}
    {/snippet}
    {#snippet buttons()}
        <button onclick={deleteLib}>
            <Delete size={28} />
        </button>
        <button onclick={() => showLibCodeEditor(library, libManager)}>
            <Pencil size={28} />
        </button>
        {#if library?.headers.downloadUrl}
            <button onclick={() => checkLibUpdate(library)}>
                <Update size={28} />
            </button>
        {/if}
    {/snippet}
</SvelteComponent>