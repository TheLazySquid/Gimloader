<script lang="ts">
    import type { FishtopiaData } from "../types";

    export let data: FishtopiaData;
</script>

<div class="row">
    <select bind:value={data.timerPosition}>
        <option value="top left">Top left</option>
        <option value="top right">Top right</option>
        <option value="bottom left">Bottom left</option>
        <option value="bottom right">Bottom right</option>
    </select>
    Timer position
</div>
<div class="row">
    <input type="checkbox" bind:checked={data.showSplits} />
    Show splits
</div>
<div class="row">
    <input type="checkbox" bind:checked={data.showSplitTimes} />
    Show split times
</div>
<div class="row">
    <input type="checkbox" bind:checked={data.showSplitComparisons} />
    Show split comparisons
</div>
<div class="row">
    <input type="checkbox" bind:checked={data.showSplitTimeAtEnd} />
    Show split time at end
</div>

<style>
    .row {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    input {
        width: 20px;
        height: 20px;
    }
</style>