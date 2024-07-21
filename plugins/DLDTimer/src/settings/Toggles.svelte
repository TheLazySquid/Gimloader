<script lang="ts">
    let showSplitComparisons = GL.storage.getValue("DLD Timer", "showSplitComparisons", true);
    let autostartILs = GL.storage.getValue("DLD Timer", "autostartILs", false);

    $: GL.storage.setValue("DLD Timer", "showSplitComparisons", showSplitComparisons);
    $: GL.storage.setValue("DLD Timer", "autostartILs", autostartILs);
</script>

<div class="row">
    <input type="checkbox" bind:checked={showSplitComparisons} />
    Show split comparisons
</div>
<div class="row">
    <input type="checkbox" bind:checked={autostartILs} />
    Start ILs upon using savestates to warp there
</div>
<div class="note">
    For summit one this will only happen if you don't have full game selected
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
</style>