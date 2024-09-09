<script lang="ts">
    import type { Gimloader } from "../../gimloader";
    import LibraryCardsList from "./libraries/LibraryCardsList.svelte";
    import PluginCardsList from "./plugins/PluginCardsList.svelte";
    import { Tabs, TabItem, Modal } from "flowbite-svelte";
    
    import Wrench from 'svelte-material-icons/Wrench.svelte';
    import Book from 'svelte-material-icons/Book.svelte';
    import KeyboardOutline from 'svelte-material-icons/KeyboardOutline.svelte';
    import Update from 'svelte-material-icons/Update.svelte';
    import Cog from 'svelte-material-icons/Cog.svelte';
    import Updates from "./Updates.svelte";
    import Settings from "./Settings.svelte";

    export let gimloader: Gimloader;
    export let onClose: () => void;
</script>

<div class="h-full">
    <div class="preflight fadeBg fixMargin">
        <Modal class="zoomIn space-y-0 text-gray-600 min-h-[65vh]"
            size="xl" on:close={onClose} open outsideclose>
            <Tabs contentClass="bg-white">
                <TabItem open>
                    <div slot="title" class="flex items-center">
                        <Wrench size={24} />
                        <span class="ml-2">Plugins</span>
                    </div>
                    <PluginCardsList pluginManager={gimloader.pluginManager}
                        libManager={gimloader.lib} />
                </TabItem>
                <TabItem>
                    <div slot="title" class="flex items-center">
                        <Book size={24} />
                        <span class="ml-2">Libraries</span>
                    </div>
                    <LibraryCardsList libManager={gimloader.lib} />
                </TabItem>
                <TabItem>
                    <div slot="title" class="flex items-center">
                        <Update size={24} />
                        <span class="ml-2">Updates</span>
                    </div>
                    <Updates {gimloader} />
                </TabItem>
                <TabItem>
                    <div slot="title" class="flex items-center">
                        <Cog size={24} />
                        <span class="ml-2">Settings</span>
                    </div>
                    <Settings {gimloader} />
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

    .fixMargin div:has(> div[role="tabpanel"]) {
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