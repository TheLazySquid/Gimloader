<script lang="ts">
    import toast_, { type Toast } from "svelte-5-french-toast";
    import Check from "svelte-material-icons/Check.svelte";
    import Close from "svelte-material-icons/Close.svelte";
    import Port from "$shared/port.svelte";

    let { toast, availableUpdates }: { toast: Toast, availableUpdates: string[] } = $props();

    function apply(apply: boolean) {
        Port.sendAndRecieve("applyUpdates", { apply });
        toast_.dismiss(toast.id);
    }
</script>

<div class="preflight flex gap-1">
    <div>
        {#if availableUpdates.length === 1}
            {availableUpdates[0]} has an update available. Would you like to download it?
        {:else if availableUpdates.length === 2}
            {availableUpdates[0]} and {availableUpdates[1]} both have updates available. Would you like to download them?
        {:else}
            {availableUpdates.slice(0, -1).join(", ")}, and {availableUpdates[availableUpdates.length - 1]}
            all have updates available. Would you like to download them?
        {/if}
    </div>
    <button onclick={() => apply(true)}>
        <Check size={24} color="#925dfe" />
    </button>
    <button onclick={() => apply(false)}>
        <Close size={24} color="#925dfe" />
    </button>
</div>