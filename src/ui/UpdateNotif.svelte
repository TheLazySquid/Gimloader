<script lang="ts">
    import { Toast } from "flowbite-svelte";
    import Check from "svelte-material-icons/Check.svelte";

    let { onSelected, amount }: { onSelected: (confirmed: boolean) => void, amount: number } = $props();
</script>

<Toast position="bottom-right" class="z-50 preflight" on:close={() => onSelected(false)}>
    <div class="flex items-center">
        {amount} {amount == 1 ? 'plugin/library has an update' : 'plugins/libraries have updates'} available!
        Would you like to install {amount == 1 ? 'it' : 'them'}?
        <button onclick={() => onSelected(true)}>
            <Check size={24} color="#925dfe" />
        </button>
    </div>
</Toast>