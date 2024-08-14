<script lang="ts">
    import { fmtMs, parseTime } from "../util";

    export let splits: string[];
    export let data: Record<string, any>;
    export let category: string;

    function resetSplits() {
        let conf = confirm("Are you sure you want to reset all splits for this category?");
        if(!conf) return;

        data.pb[category] = [];
        data.bestSplits[category] = [];
    }
</script>

<div>
    Attempts:
    <input type="number" bind:value={data.attempts[category]} />
</div>
<table>
    <tr>
        <th style="min-width: 80px;">Split</th>
        <th style="min-width: 80px;">Best Split</th>
        <th style="min-width: 80px;">Split during PB</th>
    </tr>
    {#each splits as split, i}
        <tr>
            <td>{split}</td>
            <td>
                <input value={data.bestSplits[category]?.[i] ? fmtMs(data.bestSplits[category][i]) : ''} on:change={(e) => {
                    if(e.currentTarget.value === '') {
                        data.bestSplits[category][i] = undefined;
                        return;
                    }
                    
                    let ms = parseTime(e.currentTarget.value);
                    if(!data.bestSplits[category]) data.bestSplits[category] = [];
                    data.bestSplits[category][i] = ms;
                }} />
            </td>
            <td>
                <input value={data.pb[category]?.[i] ? fmtMs(data.pb[category][i]) : ''} on:change={(e) => {
                    let ms = parseTime(e.currentTarget.value);
                    if(!data.pb[category]) data.pb[category] = [];
                    data.pb[category][i] = ms;
                }} />
            </td>
        </tr>
    {/each}
</table>
<button on:click={resetSplits}>
    Reset splits
</button>