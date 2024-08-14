<script lang="ts">
    import type { DLDData } from "../types";

    export let data: DLDData;

    let hasInputRecorder = GL.pluginManager.isEnabled("InputRecorder");
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
<div class="row">
    <input type="checkbox" bind:checked={data.autostartILs} />
    Start ILs upon using savestates to warp there
</div>
<div class="note">
    For summit one this will only happen if you don't have full game selected
</div>
<div class="row">
    <input type="checkbox" bind:checked={data.autoRecord} />
    Automatically record all runs and save PBs
</div>
<div class="note" class:error={!hasInputRecorder}>
    This requires that you have the InputRecorder plugin installed and enabled{hasInputRecorder ? "" : " (which you don't)"}
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

    .note {
        font-size: 0.7em;
        color: gray;
    }

    .error {
        color: red;
    }
</style>