<script lang="ts">
    import { Toggle } from 'flowbite-svelte';
    import state from '$shared/bareState.svelte';
    import type { PluginInfo } from '$types/state';
    import Port from '$shared/port.svelte';

    function onToggle(plugin: PluginInfo) {
        Port.send("pluginToggled", { name: plugin.name, enabled: plugin.enabled });
    }
</script>

<div class="w-full h-full preflight bg-slate-900 text-white">
    <div class="flex items-center gap-2 px-1 border-b">
        <img src="./images/icon128.png" alt="The Gimloader icon" class="w-6 h-6" />
        <h1 class="whitespace-nowrap text-2xl font-bold">Gimloader</h1>
    </div>
    <div class="max-h-[500px] overflow-y-auto w-full p-1">
        {#if state.plugins.length === 0}
            <div class="w-full text-center text-xl font-semibold">
                No plugins installed!
            </div>
        {:else}
            {#each state.plugins as plugin}
                <div class="text-lg flex items-center">
                    <Toggle size="small" on:change={() => onToggle(plugin)} bind:checked={plugin.enabled} />
                    <div>
                        {plugin.name}
                    </div>
                </div>
            {/each}
        {/if}
    </div>
</div>