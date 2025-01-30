<script lang="ts">
    import type { Snippet } from "svelte";
    import DotsGrid from "svelte-material-icons/DotsGrid.svelte";

    interface Props {
        startDrag: () => void;
        dragDisabled: boolean;
        loading?: boolean;
        dragAllowed?: boolean;
        error?: boolean;
        header?: Snippet;
        toggle?: Snippet;
        author?: Snippet;
        description?: Snippet;
        buttons?: Snippet;
    }

    let {
        startDrag,
        dragDisabled,
        loading = false,
        dragAllowed = true,
        error,
        header,
        toggle,
        author,
        description,
        buttons
    }: Props = $props();

    function checkDrag() {
        if(dragAllowed) startDrag();
    }
</script>

<div class="{error ? 'border-2 border-red-500' : 'border border-gray-500'}
h-full relative bg-white min-h-[150px] rounded-xl preflight flex flex-col p-3">
    {#if loading}
        <div class="absolute bottom-0 left-0 z-0 overflow-hidden w-full rounded-bl-xl rounded-br-xl h-6 animWrap">
            <div class="loadAnim w-40 bg-primary-500 h-1 z-0 mt-5"></div>
        </div>
    {/if}
    <div class="w-full flex gap-2 items-center leading-3">
        {@render header?.()}
        {@render toggle?.()}
    </div>
    <div class="overflow-ellipsis overflow-hidden whitespace-nowrap w-full text-base leading-4">
        {@render author?.()}
    </div>
    <div class="flex-grow text-sm pr-7 overflow-hidden overflow-ellipsis line-clamp-6">
        {@render description?.()}
    </div>
    <div class="flex flex-row-reverse items-end">
        {@render buttons?.()}
    </div>
    <div class="absolute right-3 top-1/2 transform -translate-y-1/2"
    style='cursor: {dragAllowed ? dragDisabled ? 'grab' : 'grabbing' : 'not-allowed'}'
    title={dragAllowed ? '' : 'Cannot rearrange while searching'}
    class:opacity-50={!dragAllowed} onpointerdown={checkDrag}>
        <DotsGrid size={28} />
    </div>
</div>

<style src="./loadAnim.css"></style>