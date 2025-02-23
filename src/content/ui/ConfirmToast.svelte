<script lang="ts">
    import toast_, { type Toast } from "svelte-5-french-toast";
    import Check from "svelte-material-icons/Check.svelte";
    import Close from "svelte-material-icons/Close.svelte";

    let { toast, text, onconfirmed }:
        { toast: Toast, text: string, onconfirmed: (confirmed: boolean) => void } = $props();

    function confirm(confirmed: boolean) {
        toast_.dismiss(toast.id);
        onconfirmed(confirmed);
    }
</script>

<div class="preflight flex gap-1">
    <div>
        {text}
    </div>
    <button onclick={() => confirm(true)}>
        <Check size={24} color="#925dfe" />
    </button>
    <button onclick={() => confirm(false)}>
        <Close size={24} color="#925dfe" />
    </button>
</div>