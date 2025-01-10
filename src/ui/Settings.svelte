<script lang="ts">
    import { Toggle } from "flowbite-svelte";
    import { checkScriptUpdate } from "$core/net/checkUpdates";
    import { settings } from "$src/consts.svelte";
    import Storage from "$core/storage";
    import Poller from "$core/poller.svelte";

    function saveAutoUpdate() {
        Storage.setValue('autoUpdate', settings.autoUpdate);

        if(settings.autoUpdate) {
            checkScriptUpdate(false);
        }
    }

    function saveAutoDownloadLibs() {
        Storage.setValue('autoDownloadMissingLibs', settings.autoDownloadMissingLibs);
    }
</script>

<h1 class="text-xl font-bold">General Settings</h1>
<div class="flex items-center mb-2">
    <Toggle bind:checked={settings.autoUpdate} on:change={saveAutoUpdate} />
    Automatically check for updates
</div>
<div class="flex items-center mb-2">
    <Toggle bind:checked={settings.showPluginButtons} on:change={() => {
        if(!settings.showPluginButtons) {
            let conf = confirm("Are you sure you want to hide the buttons that open the Gimloader menu? " +
                "The menu is still accessible by pressing Alt+P or by clicking on Violentmonkey's icon.");
            if(!conf) {
                settings.showPluginButtons = true;
                return;
            }
        }
        Storage.setValue("showPluginButtons", settings.showPluginButtons);
    }} />
    Show buttons to open Gimloader menu
</div>
<div class="flex items-center">
    <Toggle bind:checked={settings.autoDownloadMissingLibs} on:change={saveAutoDownloadLibs} />
    Attempt to automatically download missing libraries
</div>
<h1 class="text-xl font-bold">Developer Settings</h1>
<div class="flex items-center">
    <Toggle bind:checked={Poller.enabled} on:change={() => {
        Poller.setEnabled(Poller.enabled);
    }} />
    Poll for plugins/libraries being served locally
</div>