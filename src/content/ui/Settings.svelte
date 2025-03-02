<script lang="ts">
    import { Toggle, Button } from "flowbite-svelte";
    import Storage from "$core/storage.svelte";
    import { isFirefox } from "$shared/consts";
    import StateManager from "$core/state";

    function saveAutoUpdate() {
        Storage.updateSetting('autoUpdate', Storage.settings.autoUpdate);
    }

    function saveAutoDownloadLibs() {
        Storage.updateSetting('autoDownloadMissingLibs', Storage.settings.autoDownloadMissingLibs);
    }
</script>

<h1 class="text-xl font-bold">General Settings</h1>
<div class="flex items-center mb-2">
    <Toggle bind:checked={Storage.settings.autoUpdate} on:change={saveAutoUpdate} />
    Automatically check for plugin updates
</div>
<div class="flex items-center mb-2">
    <Toggle bind:checked={Storage.settings.showPluginButtons} on:change={() => {
        if(!Storage.settings.showPluginButtons) {
            let conf = confirm("Are you sure you want to hide the buttons that open the Gimloader menu? " +
                "The menu is still accessible by pressing Alt+P.");
            if(!conf) {
                Storage.settings.showPluginButtons = true;
                return;
            }
        }
        Storage.updateSetting("showPluginButtons", Storage.settings.showPluginButtons);
    }} />
    Show buttons to open Gimloader menu
</div>
<div class="flex items-center">
    <Toggle bind:checked={Storage.settings.autoDownloadMissingLibs} on:change={saveAutoDownloadLibs} />
    Attempt to automatically download missing libraries
</div>

<h1 class="text-xl font-bold mt-3">Developer Settings</h1>
<div class="flex items-center {isFirefox && "opacity-50 pointer-events-none"}">
    <Toggle bind:checked={Storage.settings.pollerEnabled} on:change={() => {
        Storage.updateSetting("pollerEnabled", Storage.settings.pollerEnabled);
    }} disabled={isFirefox} />
    Poll for plugins/libraries being served locally
</div>
{#if isFirefox}
    <div>
        Polling for local plugins/libraries is unavailable for Firefox.
    </div>
{/if}

<h1 class="text-xl font-bold mt-3">Export/Import Config</h1>
<div>Your config consists of plugins, plugin values, libraries, hotkeys, and settings.</div>
<Button onclick={StateManager.downloadState}>Export Config</Button>
<Button onclick={StateManager.loadState}>Import Config</Button>