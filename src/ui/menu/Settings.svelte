<script lang="ts">
    import { Toggle } from "flowbite-svelte";
    import type { Gimloader } from "../../gimloader";
    import { checkScriptUpdate } from "$src/net/checkUpdates";

    export let gimloader: Gimloader;
    let buttonsEnabled = gimloader.UI.showPluginButtons;
    let pollEnabled = gimloader.poller.enabled;

    function saveAutoUpdate() {
        GM_setValue('autoUpdate', gimloader.autoUpdate);

        if(gimloader.autoUpdate) {
            checkScriptUpdate(gimloader, false);
        }
    }
</script>

<h1 class="text-xl font-bold">General Settings</h1>
<div class="flex items-center mb-2">
    <Toggle bind:checked={gimloader.autoUpdate} on:change={saveAutoUpdate} />
    Automatically check for updates
</div>
<div class="flex items-center">
    <Toggle bind:checked={buttonsEnabled} on:change={() => {
        if(!buttonsEnabled) {
            let conf = confirm("Are you sure you want to hide the buttons that open the Gimloader menu? " +
                "The menu is still accessible by pressing Alt+P or by clicking on Violentmonkey's icon.");
            if(!conf) {
                buttonsEnabled = true;
                return;
            }
        }
        gimloader.UI.setShowPluginButtons(gimloader, buttonsEnabled);
    }} />
    Show buttons to open Gimloader menu
</div>
<h1 class="text-xl font-bold">Developer Settings</h1>
<div class="flex items-center">
    <Toggle bind:checked={pollEnabled} on:change={() => {
        gimloader.poller.setEnabled(pollEnabled);
    }} />
    Poll for plugins/libraries being served locally
</div>