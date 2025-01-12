<script lang="ts">
    import LibraryCardsList from "./libraries/LibraryCardsList.svelte";
    import PluginCardsList from "./plugins/PluginCardsList.svelte";
    import { Tabs, TabItem } from "flowbite-svelte";
    import Modal from './flowbite/Modal.svelte';
    import { focusTrapEnabled } from "./stores";
    
    import Wrench from 'svelte-material-icons/Wrench.svelte';
    import Book from 'svelte-material-icons/Book.svelte';
    import KeyboardOutline from 'svelte-material-icons/KeyboardOutline.svelte';
    import Update from 'svelte-material-icons/Update.svelte';
    import Cog from 'svelte-material-icons/Cog.svelte';
    import Updates from "./Updates.svelte";
    import Settings from "./Settings.svelte";
    import Hotkeys from "./Hotkeys.svelte";

    interface Props {
        onClose: () => void;
    }

    let { onClose }: Props = $props();
</script>

<div class="h-full">
    <div class="preflight fadeBg fixMargin">
        <Modal class="zoomIn space-y-0 text-gray-600 min-h-[65vh]"
            size="xl" on:close={onClose} open outsideclose focusTrapEnabled={$focusTrapEnabled}>
            <Tabs contentClass="bg-white">
                <TabItem open>
                    <div class="flex items-center" slot="title">
                        <Wrench size={24} />
                        <span class="ml-2">Plugins</span>
                    </div>
                    <PluginCardsList />
                </TabItem>
                <TabItem>
                    <div class="flex items-center" slot="title">
                        <Book size={24} />
                        <span class="ml-2">Libraries</span>
                    </div>
                    <LibraryCardsList />
                </TabItem>
                <TabItem>
                    <div class="flex items-center" slot="title">
                        <KeyboardOutline size={24} />
                        <span class="ml-2">Hotkeys</span>
                    </div>
                    <Hotkeys />
                </TabItem>
                <TabItem>
                    <div class="flex items-center" slot="title">
                        <Update size={24} />
                        <span class="ml-2">Updates</span>
                    </div>
                    <Updates />
                </TabItem>
                <TabItem>
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

    .fixMargin .h-px {
        margin-top: 0 !important;
    }

    .fixMargin div:has(:global(> div[role="tabpanel"])) {
        display: flex;
        flex-direction: column;
    }

    .fixMargin div[role="tabpanel"] {
        margin-top: 2px !important;
        flex-grow: 1;
        min-width: 0;
        min-height: 0;
    }

    .fixMargin div[role="tabpanel"] > div {
        height: 100%;
    }
</style>