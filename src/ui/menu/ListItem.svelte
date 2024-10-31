<script lang="ts">
    import DotsGrid from "svelte-material-icons/DotsGrid.svelte";
    import ChevronRight from "svelte-material-icons/ChevronRight.svelte";

    export let startDrag: () => void;
    export let dragDisabled: boolean;
    export let loading = false;

    let expanded = false;
</script>

<div class="border border-gray-500 p-3 h-full bg-white preflight rounded-xl relative">
    <div class="flex items-center">
        {#if loading}
            <div class="absolute bottom-0 left-0 z-0 overflow-hidden w-full rounded-bl-xl rounded-br-xl h-6 animWrap">
                <div class="loadAnim w-40 bg-primary-500 h-1 z-0 mt-5"></div>
            </div>
        {/if}
        <button class="transition-transform" style={expanded ? 'transform: rotate(90deg)' : ''}
        on:click={() => expanded = !expanded}>
            <ChevronRight width={28} height={28} />
        </button>
        <slot name="toggle" />
        <div class="flex-grow leading-3 ml-2 min-w-0">
            <slot name="header" />
        </div>

        <div class="flex flex-row-reverse items-end">
            <slot name="buttons" />
        </div>
        <div style={dragDisabled ? 'cursor: grab' : 'cursor: grabbing'} on:pointerdown={startDrag}>
            <DotsGrid size={28} />
        </div>
    </div>
    {#if expanded}
        <div class="ml-7">
            <div class="overflow-ellipsis overflow-hidden whitespace-nowrap w-full text-base leading-4">
                <slot name="author" />
            </div>
            <div class="flex-grow text-sm pr-7 overflow-hidden overflow-ellipsis">
                <slot name="description" />
            </div>
        </div>
    {/if}
</div>

<style src="./loadAnim.css"></style>