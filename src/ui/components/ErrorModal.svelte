<script lang="ts">
    import { Modal } from "flowbite-svelte";

    interface Props {
        title: string;
        msg: string;
        onClose: () => void;
    }

    let { title, msg, onClose }: Props = $props();
</script>

<Modal class="preflight" {title} open outsideclose onclose={onClose}>
    <pre>{msg}</pre>
</Modal>