<script lang="ts">
    import { categories, splitNames } from '../constants';
    import FullGame from './FullGame.svelte';
    import IlSettings from './ILSettings.svelte';
    import Toggles from './Toggles.svelte';
    import type Autosplitter from '../autosplitter';

    export let autosplitter: Autosplitter;
    
    let category = categories[0];
    let mode = 'Full Game';
</script>

<select bind:value={category}>
    {#each categories as category}
        <option value={category}>{category}</option>
    {/each}
</select>

<select bind:value={mode}>
    <option value="Full Game">Full Game</option>
    {#each splitNames as split, i}
        <option value="{i}">{split}</option>
    {/each}
</select>

<!-- Lazy way to do it but I don't care -->
{#key mode}
    {#key category}
        {#if mode !== "Full Game"}
            <IlSettings {category} summit={parseInt(mode)} />
        {:else}    
            <FullGame {category} />
        {/if}
    {/key}
{/key}

<hr>

<Toggles {autosplitter} />