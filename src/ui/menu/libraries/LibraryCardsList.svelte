<script lang="ts">
    import { flip } from "svelte/animate";
    import { dndzone } from "svelte-dnd-action";
    import type { LibManagerType } from "../../../lib/libManager";
    import LibraryCard from "./LibraryCard.svelte";
    import type Lib from "../../../lib/lib";
    import { Button, Dropdown, DropdownItem } from "flowbite-svelte";

    import PlusBoxOutline from 'svelte-material-icons/PlusBoxOutline.svelte';
    import Import from 'svelte-material-icons/Import.svelte';
    import ChevronDown from 'svelte-material-icons/ChevronDown.svelte';
    import { createLib } from "../../editCodeModals";
    import { readUserFile } from "../../../util";

    const flipDurationMs = 300;

    export let libManager: LibManagerType;
    let { libs } = libManager;

    let items = $libs.map((lib: Lib) => ({ id: lib.headers.name }));
    $: items = $libs.map((lib: Lib) => ({ id: lib.headers.name }));

    let dragDisabled = true;

    function handleDndConsider(e: any) {
        items = e.detail.items;
    }

    function handleDndFinalize(e: any) {
        items = e.detail.items;
        dragDisabled = true;

        // Update the order of the libraries
        let newOrder = [];
        for (let item of items) {
            let lib = $libs.find((l: Lib) => l.headers.name === item.id);
            if (lib) newOrder.push(lib);
        }
        libManager.libs.set(newOrder);
        libManager.save();
    }

    function startDrag() {
        dragDisabled = false;
    }

    let bulkOpen = false;

    function deleteAll() {
        bulkOpen = false;
        
        if($libs.length === 0) return;
        const conf = confirm(`Are you sure you want to delete all libraries?`);
        if(!conf) return;

        for(let i = $libs.length - 1; i >= 0; i--) {
            let lib = $libs[i];
            libManager.deleteLib(lib);
        }
    }

    function importLib() {
        readUserFile(".js")
            .then((code) => {
                code = code.replaceAll("\r\n", "\n");
                libManager.createLib(code);
            })
            .catch(() => {});
    }
</script>

<div class="flex flex-col">
    <div class="flex items-center mb-[3px]">
        <button on:click={() => createLib(libManager)}>
            <PlusBoxOutline size={32} />
        </button>
        <button on:click={importLib}>
            <Import size={32} />
        </button>
        <Button class="h-7 mr-2">Bulk actions<ChevronDown class="ml-1" size={20} /></Button>
        <Dropdown bind:open={bulkOpen}>
            <DropdownItem on:click={deleteAll}>Delete all</DropdownItem>
        </Dropdown>
    </div>
    {#if $libs.length === 0}
        <h2 class="text-xl">No libraries installed!</h2>
    {/if}
    <div class="max-h-full overflow-y-auto grid gap-4 libs pb-1 flex-grow"
    use:dndzone={{ items, flipDurationMs, dragDisabled, dropTargetStyle: {} }}
    on:consider={handleDndConsider} on:finalize={handleDndFinalize}>
        {#each items as item (item.id)}
            {@const library = libManager.getLib(item.id)}
            <div animate:flip={{ duration: flipDurationMs }}>
                <LibraryCard {library} {startDrag} {dragDisabled} {libManager} />
            </div>
        {/each}
    </div>
</div>

<style>
    .libs {
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    }
</style>