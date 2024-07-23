<script lang="ts">
    import type Autosplitter from "../autosplitter";

    export let autosplitter: Autosplitter;

    let showSplits = GL.storage.getValue("DLD Timer", "showSplits", true);
    let showSplitTimes = GL.storage.getValue("DLD Timer", "showSplitTimes", true);
    let showSplitComparisons = GL.storage.getValue("DLD Timer", "showSplitComparisons", true);
    let showSplitTimeAtEnd = GL.storage.getValue("DLD Timer", "showSplitTimeAtEnd", true);
    let autostartILs = GL.storage.getValue("DLD Timer", "autostartILs", false);
    let autoRecord = GL.storage.getValue("DLD Timer", "autoRecord", true);

    $: GL.storage.setValue("DLD Timer", "showSplits", showSplits);
    $: GL.storage.setValue("DLD Timer", "showSplitTimes", showSplitTimes);
    $: GL.storage.setValue("DLD Timer", "showSplitComparisons", showSplitComparisons);
    $: GL.storage.setValue("DLD Timer", "showSplitTimeAtEnd", showSplitTimeAtEnd);
    $: GL.storage.setValue("DLD Timer", "autostartILs", autostartILs);
    $: GL.storage.setValue("DLD Timer", "autoRecord", autoRecord);
    
    $: autosplitter.autostartILs = autostartILs;
    $: autosplitter.autoRecord = autoRecord;

    let hasInputRecorder = GL.pluginManager.isEnabled("InputRecorder");
</script>

<div class="row">
    <input type="checkbox" bind:checked={showSplits} />
    Show splits
</div>
<div class="row">
    <input type="checkbox" bind:checked={showSplitTimes} />
    Show split times
</div>
<div class="row">
    <input type="checkbox" bind:checked={showSplitComparisons} />
    Show split comparisons
</div>
<div class="row">
    <input type="checkbox" bind:checked={showSplitTimeAtEnd} />
    Show split time at end
</div>
<div class="row">
    <input type="checkbox" bind:checked={autostartILs} />
    Start ILs upon using savestates to warp there
</div>
<div class="note">
    For summit one this will only happen if you don't have full game selected
</div>
<div class="row">
    <input type="checkbox" bind:checked={autoRecord} />
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