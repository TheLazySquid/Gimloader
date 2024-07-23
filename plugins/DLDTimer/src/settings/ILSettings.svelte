<script lang="ts">
    import { fmtMs, parseTime } from "../util";

    export let category: string;
    export let summit: number;

    let id = `${category}-${summit}`;

    let noPreboostsAttempts: number = GL.storage.getValue("DLD Timer", `attempts-${id}`, 0);
    let noPreboostsPb: number | null = GL.storage.getValue("DLD Timer", `ilpb-${id}`, null);
    let preboostAttempts = GL.storage.getValue("DLD Timer", `attempts-${id}-preboosts`, 0);
    let preboostPb = GL.storage.getValue("DLD Timer", `ilpb-${id}-preboosts`, null);

    // Saves uneccesarily (I do not care)
    $: GL.storage.setValue("DLD Timer", `attempts-${id}`, noPreboostsAttempts);
    $: if(noPreboostsPb) GL.storage.setValue("DLD Timer", `ilpb-${id}`, noPreboostsPb);
    $: GL.storage.setValue("DLD Timer", `attempts-${id}-preboosts`, preboostAttempts);
    $: if(preboostPb) GL.storage.setValue("DLD Timer", `ilpb-${id}-preboosts`, preboostPb);
</script>

<h2>No Preboosts</h2>
<div class="grid">
    <div>Attempts:</div>
    <input type="number" bind:value={noPreboostsAttempts} />
    <div>Personal best:</div>
    <input value={noPreboostsPb ? fmtMs(noPreboostsPb) : ''} on:change={(e) => {
        if(!e.currentTarget.value) {
            noPreboostsPb = null;
            return;
        }
        let ms = parseTime(e.currentTarget.value);
        noPreboostsPb = ms;
    }} />
</div>
{#if category !== "Current Patch"}
    <h2>Preboosts</h2>
    <div class="grid">
        <div>Attempts:</div>
        <input type="number" bind:value={preboostAttempts} />
        <div>Personal best:</div>
        <input value={preboostPb ? fmtMs(preboostPb) : ''} on:change={(e) => {
            if(!e.currentTarget.value) {
                preboostPb = null;
                return;
            }
            let ms = parseTime(e.currentTarget.value);
            preboostPb = ms;
        }} />
    </div>
{/if}

<style>
    .grid {
        display: grid;
        gap: 5px;
        grid-template-columns: max-content max-content;
    }
</style>