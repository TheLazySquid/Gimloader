<script lang="ts">
    import { Toggle } from "flowbite-svelte";
    import type { Gimloader } from "../../gimloader";

    export let gimloader: Gimloader;
    let enabled = gimloader.poller.enabled;
</script>

<h1 class="text-xl font-bold">Developer Settings</h1>
<div class="flex items-center">
    <Toggle bind:checked={enabled} on:change={() => {
        gimloader.poller.setEnabled(enabled);
    }} />
    Poll for plugins/libraries being served locally
</div>