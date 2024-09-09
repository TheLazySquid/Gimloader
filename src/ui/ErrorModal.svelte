<script lang="ts">
    import { Modal } from "flowbite-svelte";

    export let title: string;
    export let msg: string;
    export let onClose: () => void;
</script>

<Modal class="preflight" {title} open outsideclose on:close={onClose}>
    <pre>{msg}</pre>
</Modal>