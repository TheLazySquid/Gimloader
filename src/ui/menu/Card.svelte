<script lang="ts">
    import DotsGrid from "svelte-material-icons/DotsGrid.svelte";

    export let startDrag: () => void;
    export let dragDisabled: boolean;
</script>

<div class="border border-gray-500 p-3 h-fit relative bg-white min-h-[150px] flex flex-col preflight rounded-xl">
    <div class="w-full flex items-center">
        <slot name="header" />
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