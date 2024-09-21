<script lang="ts">
    import { oneWayOutSplits } from "../constants";
    import type { SplitsData } from "../types";
    import FishtopiaToggles from "./SplitsToggles.svelte";
    import FullGame from "./FullGame.svelte";

    export let data: SplitsData;
</script>

<FullGame splits={oneWayOutSplits} {data} category="OneWayOut" />
<hr>
<FishtopiaToggles {data} />