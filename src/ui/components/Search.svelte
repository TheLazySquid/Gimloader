<script lang="ts">
    import Magnify from 'svelte-material-icons/Magnify.svelte';
    import Close from 'svelte-material-icons/Close.svelte';

    interface Props {
        value?: string;
    }

    let { value = $bindable("") }: Props = $props();
    let searchInput: HTMLInputElement = $state();
    let searchOpen = $state(false);

    function openSearch() {
        searchInput.style.display = "block";
        searchInput.focus();
        searchOpen = true;
    }

    function closeSearch() {
        searchInput.style.display = "none";
        searchOpen = false;
        value = "";
    }

    function onKeyDown(e: KeyboardEvent) {
        if(e.key === 'Escape') {
            closeSearch();
            e.stopPropagation();
        }
    }

    function windowKeyDown(e: KeyboardEvent) {
        if(e.key == 'f' && e.ctrlKey) {
            e.preventDefault();
            openSearch();
        }
    }
</script>

<svelte:window onkeydown={windowKeyDown} />
<button class="ml-2" onclick={openSearch}>
    <Magnify />
</button>
<input type="text" class="ml-1 border-t-0 border-x-0 p-0 !border-gray-500"
bind:value={value} bind:this={searchInput} onkeydown={onKeyDown}
style="box-shadow: none; display: none;" />
{#if searchOpen}
    <button onclick={closeSearch}>
        <Close />
    </button>
{/if}