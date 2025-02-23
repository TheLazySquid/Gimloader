<script lang="ts">
    import { Toggle } from 'flowbite-svelte';
    import state from '$shared/bareState.svelte';
    import type { PluginInfo } from '$types/state';
    import Port from '$shared/port.svelte';
    import DeleteOutline from 'svelte-material-icons/DeleteOutline.svelte';

    function onToggle(plugin: PluginInfo) {
        Port.send("pluginToggled", { name: plugin.name, enabled: plugin.enabled });
    }

    let deleting: PluginInfo | null = null;

    function onDeleteClick(e: MouseEvent, plugin: PluginInfo) {
        if(deleting === plugin) {
            Port.send("pluginDelete", { name: plugin.name });
            state.plugins.splice(state.plugins.indexOf(plugin), 1);
            deleting = null;
            return;
        }

        e.stopPropagation();
        deleting = plugin;
    }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
<div class="w-full h-full preflight bg-slate-900 text-white" onclick={() => deleting = null}>
    <div class="flex items-center gap-2 px-1 border-b">
        <img src="./images/icon128.png" alt="The Gimloader icon" class="w-6 h-6" />
        <h1 class="whitespace-nowrap text-2xl font-bold">Gimloader</h1>
    </div>
    <div class="max-h-[500px] overflow-y-auto w-full py-1">
        {#if state.plugins.length === 0}
            <div class="w-full text-center text-xl font-semibold">
                No plugins installed!
            </div>
        {:else}
            {#each state.plugins as plugin}
                <div class="text-lg flex items-center px-1" class:bg-red-600={deleting === plugin}>
                    <Toggle size="small" on:change={() => onToggle(plugin)} bind:checked={plugin.enabled} />
                    <div class="flex-grow whitespace-nowrap overflow-ellipsis overflow-x-hidden">
                        {plugin.name}
                    </div>
                    <button onclick={(e) => onDeleteClick(e, plugin)}>
                        <DeleteOutline size={24} />
                    </button>
                </div>
            {/each}
        {/if}
    </div>
</div>