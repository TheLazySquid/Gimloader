<script lang="ts">
    import type { IFrame } from "../types";
    import { uploadFile } from "../util";
    import Ui from "./UI.svelte";

    let begun = false;
    let save = GL.storage.getValue("2dMovementTAS", "save");

    let frames: IFrame[] = [];
    let startPos: { x: number, y: number } | undefined;

    function continueTAS() {
        frames = save.frames;
        startPos = save.startPos;
        begun = true;
    }

    function newTAS() {
        if(save) {
            let conf = confirm("Are you sure you want to start a new TAS? Your current TAS will be lost.");
            if(!conf) return;
        }

        frames = [];
        begun = true;
    }

    async function loadTAS() {
        if(save) {
            let conf = confirm("Are you sure you want to load a new TAS? Your current TAS will be lost.");
            if(!conf) return;
        }

        try {
            let data = await uploadFile();
            let json = JSON.parse(data);
            frames = json.frames;
            startPos = json.startPos;
            begun = true;
        } catch {}
    }
</script>

{#if begun}
    <Ui {frames} {startPos} />
{:else}
    <div>
        {#if save}
            <button on:click={continueTAS}>
                Continue TAS
            </button>
        {/if}
        <button on:click={newTAS}>
            New TAS at current position
        </button>
        <button on:click={loadTAS}>
            Load TAS from file
        </button>
    </div>
{/if}

<style>
    div {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 999999;
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 10px;
    }

    button {
        padding: 5px 20px;
        border-radius: 100px;
        background-color: rgba(0, 0, 0, 0.5);
        color: white;
        border: 1px solid black;
        transition: transform 0.2s ease;
    }

    button:hover {
        transform: scale(1.05);
    }

    button:active {
        transform: scale(0.95);
    }
</style>