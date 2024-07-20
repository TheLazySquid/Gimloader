<script lang="ts">
    export let category: string;
    import { splitNames } from "../constants";
    import { fmtMs, parseTime } from "../util";

    let attempts = GL.storage.getValue("DLD Timer", `attempts-${category}`, 0);
    let pb = GL.storage.getValue("DLD Timer", `pb-${category}`, []);
    let bestSplits = GL.storage.getValue("DLD Timer", `bestSplits-${category}`, []);

    $: GL.storage.setValue("DLD Timer", `attempts-${category}`, attempts);
    $: GL.storage.setValue("DLD Timer", `pb-${category}`, pb);
    $: GL.storage.setValue("DLD Timer", `bestSplits-${category}`, bestSplits);

    function resetSplits() {
        let conf = confirm("Are you sure you want to reset all splits for this category?");
        if(!conf) return;

        pb = [];
        bestSplits = [];

        GL.storage.removeValue("DLD Timer", `pb-${category}`);
        GL.storage.removeValue("DLD Timer", `bestSplits-${category}`);
    }
</script>

<div>
    Attempts:
    <input type="number" bind:value={attempts} />
</div>
<table>
    <tr>
        <th style="min-width: 80px;">Split</th>
        <th style="min-width: 80px;">Best Split</th>
        <th style="min-width: 80px;">Split during PB</th>
    </tr>
    {#each splitNames as split, i}
        <tr>
            <td>{split}</td>
            <td>
                <input value={bestSplits[i] ? fmtMs(bestSplits[i]) : ''} on:change={(e) => {
                    let ms = parseTime(e.currentTarget.value);
                    bestSplits[i] = ms;
                }} />
            </td>
            <td>
                <input value={pb[i] ? fmtMs(pb[i]) : ''} on:change={(e) => {
                    let ms = parseTime(e.currentTarget.value);
                    pb[i] = ms;
                }} />
            </td>
        </tr>
    {/each}
</table>
<button on:click={resetSplits}>
    Reset splits
</button>