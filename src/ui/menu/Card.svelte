<script lang="ts">
    import DotsGrid from "svelte-material-icons/DotsGrid.svelte";

    export let startDrag: () => void;
    export let dragDisabled: boolean;
    export let loading = false;
</script>

<div class="border border-gray-500 p-3 h-full relative bg-white min-h-[150px] flex flex-col
    preflight rounded-xl">
    {#if loading}
        <div class="absolute bottom-0 left-0 z-0 overflow-hidden w-full rounded-bl-xl rounded-br-xl h-6 animWrap">
            <div class="loadAnim w-40 bg-primary-500 h-1 z-0 mt-5"></div>
        </div>
    {/if}
    <div class="w-full flex gap-2 items-center leading-3">
        <slot name="header" />
    </div>
    <div class="overflow-ellipsis overflow-hidden whitespace-nowrap w-full text-base leading-4">
        <slot name="author" />
    </div>
    <div class="flex-grow text-sm pr-7 overflow-hidden overflow-ellipsis line-clamp-6">
        <slot name="description" />
    </div>
    <div class="flex flex-row-reverse items-end">
        <slot name="buttons" />
    </div>
    <div class="absolute right-3 top-1/2 transform -translate-y-1/2"
    style={dragDisabled ? 'cursor: grab' : 'cursor: grabbing'} on:pointerdown={startDrag}>
        <DotsGrid size={28} />
    </div>
</div>

<style>
    .animWrap {
        pointer-events: none;
    }

    .loadAnim {
        position: relative;
        animation: loading infinite 1s ease-in-out;
    }

    .loadAnim:after, .loadAnim:before {
        content: "";
        z-index: 1;
        position: absolute;
        bottom: 0;
        height: 100%;
        width: 45px;
    }

    .loadAnim:after {
        right: 0;
        background-image: linear-gradient(to right, rgba(255,255,255,0), rgba(255,255,255,1) 85%);
    }

    .loadAnim:before {
        left: 0;
        background-image: linear-gradient(to left, rgba(255,255,255,0), rgba(255,255,255,1) 85%);
    }

    @keyframes loading {
        0% {
            margin-left: -160px;
        }
        100% {
            margin-left: 100%;
        }
    }
</style>