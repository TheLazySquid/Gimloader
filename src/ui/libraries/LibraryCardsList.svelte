<script lang="ts">
    import type Lib from "$src/core/libManager/lib.svelte";
    import { flip } from "svelte/animate";
    import { dndzone } from "svelte-dnd-action";
    import Library from "./Library.svelte";
    import { Button, Dropdown, DropdownItem } from "flowbite-svelte";
    import { createLib } from "../editCodeModals.svelte";
    import { readUserFile } from "$src/utils";
    import LibManager from "$core/libManager/libManager.svelte";
    import { settings } from "$src/consts.svelte";
    import Storage from "$core/storage";

    import PlusBoxOutline from 'svelte-material-icons/PlusBoxOutline.svelte';
    import Import from 'svelte-material-icons/Import.svelte';
    import ChevronDown from 'svelte-material-icons/ChevronDown.svelte';
    import ViewModule from 'svelte-material-icons/ViewModule.svelte';
    import ViewList from 'svelte-material-icons/ViewList.svelte';
    import Search from "../components/Search.svelte";

    const flipDurationMs = 300;

    let searchValue = $state("");

    let items = $state(LibManager.libs.map((lib: Lib) => ({ id: lib.headers.name })));
    $effect(() => {
        items = LibManager.libs
            .filter((lib) => lib.headers.name.toLowerCase().includes(searchValue.toLowerCase()))
            .map((lib) => ({ id: lib.headers.name }));
    });

    let dragDisabled = $state(true);

    function handleDndConsider(e: any) {
        items = e.detail.items;
    }

    function handleDndFinalize(e: any) {
        items = e.detail.items;
        dragDisabled = true;

        // Update the order of the libraries
        let newOrder = [];
        for (let item of items) {
            let lib = LibManager.libs.find((l: Lib) => l.headers.name === item.id);
            if (lib) newOrder.push(lib);
        }
        LibManager.libs = newOrder;
        LibManager.save();
    }

    function startDrag() {
        dragDisabled = false;
    }

    let bulkOpen = $state(false);

    function deleteAll() {
        bulkOpen = false;
        
        if(LibManager.libs.length === 0) return;
        const conf = confirm(`Are you sure you want to delete all libraries?`);
        if(!conf) return;

        LibManager.wipe();
    }

    function importLib() {
        readUserFile(".js")
            .then((code) => {
                code = code.replaceAll("\r\n", "\n");
                LibManager.createLib(code);
            })
            .catch(() => {});
    }

    function setView(mode: string) {
        Storage.setValue('menuView', mode);
        settings.menuView = mode;
    }
</script>

<div class="flex flex-col">
    <div class="flex items-center mb-[2px]">
        <button onclick={() => createLib()}>
            <PlusBoxOutline size={32} />
        </button>
        <button onclick={importLib}>
            <Import size={32} />
        </button>
        <Button class="h-7 mr-2">Bulk actions<ChevronDown class="ml-1" size={20} /></Button>
        <Dropdown bind:open={bulkOpen}>
            <DropdownItem on:click={deleteAll}>Delete all</DropdownItem>
        </Dropdown>
        <button class="w-[30px] h-7 flex items-center justify-center rounded-md ml-1" 
        class:bg-gray-200={settings.menuView == 'grid'}
        onclick={() => setView('grid')}>
            <ViewModule width={24} height={24} />
        </button>
        <button class="w-[30px] h-7 flex items-center justify-center rounded-md ml-1"
            class:bg-gray-200={settings.menuView == 'list'}
            onclick={() => setView('list')}>
            <ViewList width={24} height={24} />
        </button>
        <Search bind:value={searchValue} />
    </div>
    {#if LibManager.libs.length === 0}
        <h2 class="text-xl">No libraries installed!</h2>
    {/if}
    <div class="max-h-full overflow-y-auto grid gap-4 libs-{settings.menuView} pb-1 flex-grow"
    use:dndzone={{ items, flipDurationMs, dragDisabled, dropTargetStyle: {} }}
    onconsider={handleDndConsider} onfinalize={handleDndFinalize}>
        {#key searchValue}
            {#each items as item (item.id)}
                {@const library = LibManager.getLib(item.id)}
                <div animate:flip={{ duration: flipDurationMs }}>
                    <Library {library} {startDrag} {dragDisabled}
                        view={settings.menuView} dragAllowed={searchValue == ''} />
                </div>
            {/each}
        {/key}
    </div>
</div>

<style>
    .libs-grid {
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    }

    .libs-list {
        grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
    }
</style>