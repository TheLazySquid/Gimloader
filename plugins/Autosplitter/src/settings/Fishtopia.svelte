<script lang="ts">
    import { fishtopiaSplits } from "../constants";
    import type { FishtopiaData } from "../types";
    import FishtopiaToggles from "./FishtopiaToggles.svelte";
    import FullGame from "./FullGame.svelte";

    export let data: FishtopiaData;
</script>

<FullGame splits={fishtopiaSplits} {data} category="fishtopia" />
<hr>
<FishtopiaToggles {data} />