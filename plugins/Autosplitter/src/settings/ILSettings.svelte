<script lang="ts">
    import { fmtMs, parseTime } from "../util";

    export let data: Record<string, any>;
    export let category: string;
    export let summit: number;

    let id = `${category}-${summit}`;
    let preboostsId = `${category}-${summit}-preboosts`;
</script>

<h2>No Preboosts</h2>
<div class="grid">
    <div>Attempts:</div>
    <input type="number" bind:value={data.attempts[id]} />
    <div>Personal best:</div>
    <input value={data.ilpbs[id] ? fmtMs(data.ilpbs[id]) : ''} on:change={(e) => {
        if(!e.currentTarget.value) {
            data.ilpbs[id] = null;
            return;
        }
        let ms = parseTime(e.currentTarget.value);
        data.ilpbs[id] = ms;
    }} />
</div>
{#if category !== "Current Patch"}
    <h2>Preboosts</h2>
    <div class="grid">
        <div>Attempts:</div>
        <input type="number" bind:value={data.attempts[preboostsId]} />
        <div>Personal best:</div>
        <input value={data.ilpbs[preboostsId] ? fmtMs(data.ilpbs[preboostsId]) : ''} on:change={(e) => {
            if(!e.currentTarget.value) {
                data.ilpbs[preboostsId] = null;
                return;
            }
            let ms = parseTime(e.currentTarget.value);
            data.ilpbs[preboostsId] = ms;
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