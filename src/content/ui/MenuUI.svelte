<script lang="ts">
    import LibraryCardsList from "./libraries/LibraryCardsList.svelte";
    import PluginCardsList from "./plugins/PluginCardsList.svelte";
    import { Tabs, TabItem } from "flowbite-svelte";
    import Modal from './flowbite/Modal.svelte';
    import { focusTrapEnabled } from "./stores";
    import Updates from "./Updates.svelte";
    import Settings from "./Settings.svelte";
    import Hotkeys from "./Hotkeys.svelte";
    import Port from "$shared/port.svelte";
    import { onMount } from "svelte";
    import toast from "svelte-5-french-toast";
    
    import Wrench from 'svelte-material-icons/Wrench.svelte';
    import Book from 'svelte-material-icons/Book.svelte';
    import KeyboardOutline from 'svelte-material-icons/KeyboardOutline.svelte';
    import Update from 'svelte-material-icons/Update.svelte';
    import Cog from 'svelte-material-icons/Cog.svelte';
    import FileUploadOutline from 'svelte-material-icons/FileUploadOutline.svelte';

    interface Props {
        onClose: () => void;
    }
    type DropCallback = (text: string) => void;

    let { onClose }: Props = $props();

    let dropCallback: DropCallback | null = $state(null);
    const onDrop = (callback: DropCallback) => {
        dropCallback = callback;
    }
    
    let wrapper: HTMLDivElement;
    let modalDragCounter = $state(0);
    onMount(() => {
        let modal: HTMLElement = wrapper.querySelector(".max-w-7xl");
        if(!modal) return;

        modal.addEventListener("dragenter", () => modalDragCounter++);
        modal.addEventListener("dragleave", () => modalDragCounter--);
        modal.addEventListener("dragover", (e) => e.preventDefault());
        modal.addEventListener("drop", async (e) => {
            e.preventDefault();
            modalDragCounter = 0;

            let file = e.dataTransfer.files[0];
            if(!file) return;

            if(file.type !== "text/javascript") {
                toast.error("That doesn't appear to be a script you can install");
                return;
            }
            let text = await file.text();
            dropCallback(text);
        });
    });
</script>

<div class="h-full">
    <div class="preflight fadeBg changeStyles" bind:this={wrapper}>
        <Modal class="zoomIn space-y-0 text-gray-600 min-h-[65vh]"
            size="xl" on:close={onClose} open outsideclose focusTrapEnabled={$focusTrapEnabled}>
            {#if Port.disconnected}
                <div class="z-50 absolute top-[-16px] left-0 w-full h-full bg-gray-500
                    rounded-lg opacity-70 flex flex-col items-center justify-center">
                    <h2 class="text-3xl text-white">Connection lost with extension</h2>
                    <div class="xl text-white">
                        Attempting to reconnect... you can always refresh the page if this fails
                    </div>
                </div>
            {/if}
            {#if dropCallback && modalDragCounter > 0}
                <div class="z-50 absolute top-[-16px] left-0 w-full h-full pointer-events-none
                    rounded-lg opacity-70 flex items-center justify-center
                    bg-gray-500 border-white border-4 border-dashed" role="dialog">
                    <FileUploadOutline size={128} color="white" />
                </div>
            {/if}
            <Tabs contentClass="bg-white">
                <TabItem open>
                    <div class="flex items-center" slot="title">
                        <Wrench size={24} />
                        <span class="ml-2">Plugins</span>
                    </div>
                    <PluginCardsList {onDrop} />
                </TabItem>
                <TabItem>
                    <div class="flex items-center" slot="title">
                        <Book size={24} />
                        <span class="ml-2">Libraries</span>
                    </div>
                    <LibraryCardsList {onDrop} />
                </TabItem>
                <TabItem on:click={() => dropCallback = null}>
                    <div class="flex items-center" slot="title">
                        <KeyboardOutline size={24} />
                        <span class="ml-2">Hotkeys</span>
                    </div>
                    <Hotkeys />
                </TabItem>
                <TabItem on:click={() => dropCallback = null}>
                    <div class="flex items-center" slot="title">
                        <Update size={24} />
                        <span class="ml-2">Updates</span>
                    </div>
                    <Updates />
                </TabItem>
                <TabItem on:click={() => dropCallback = null}>
                    <div class="flex items-center" slot="title">
                        <Cog size={24} />
                        <span class="ml-2">Settings</span>
                    </div>
                    <Settings />
                </TabItem>
            </Tabs>
        </Modal>
    </div>
</div>

<style global>
    .fadeBg > div:first-child {
        animation: fadeIn 0.3s;
    }

    .zoomIn {
        animation: zoomIn ease-out 0.15s;
    }

    .changeStyles .h-px {
        margin-top: 0 !important;
    }

    .changeStyles div:has(> div[role="tabpanel"]) {
        display: flex;
        flex-direction: column;
    }

    .changeStyles div[role="tabpanel"] {
        margin-top: 2px !important;
        flex-grow: 1;
        min-width: 0;
        min-height: 0;
    }

    .changeStyles div[role="tabpanel"] > div {
        height: 100%;
    }

    .changeStyles div[role="document"] > button {
        z-index: 100;
    }

    /* Prevent disabled toggles from becoming grayscale */
    .changeStyles label.grayscale {
        filter: none !important;
    }
</style>