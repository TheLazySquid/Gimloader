<script lang="ts">
    import { gamemodes } from "../constants";
    import type { GamemodesData } from "../types";
    import { downloadFile, getGamemodeData, readFile } from "../util";
    import Dld from "./DLD.svelte";
    import Fishtopia from "./Fishtopia.svelte";
    import OneWayOut from "./OneWayOut.svelte";

    let activeTab = gamemodes[0];
    let dataObj: any = {};

    for(let gamemode of gamemodes) {
        dataObj[gamemode] = getGamemodeData(gamemode);
    }
    
    let data = dataObj as GamemodesData;

    export function save() {
        for(let gamemode of gamemodes) {
            (window as any).GL.storage.setValue("Autosplitter", `${gamemode}Data`, data[gamemode]);
        }
    }
    
    function exportAll() {
        let json: Record<string, Record<string, any>> = {};
        for(let gamemode of gamemodes) {
            let data = (window as any).GL.storage.getValue("Autosplitter", `${gamemode}Data`);
            if(!data) continue;
            json[gamemode] = data;
        }
    
        downloadFile(JSON.stringify(json), "splits.json");
    }

    function importAll() {
        readFile()
            .then((newData) => {
                for(let gamemode of gamemodes) {
                    if(!newData[gamemode]) continue;
                    data[gamemode] = newData[gamemode];

                    (window as any).GL.storage.setValue("Autosplitter", `${gamemode}Data`, newData[gamemode]);
                }
            })
    }

    function exportMode() {
        let json = data[activeTab];
        downloadFile(JSON.stringify(json), `${activeTab}.json`);
    }

    function importMode() {
        readFile()
            .then((newData) => {
                data[activeTab] = newData;
                (window as any).GL.storage.setValue("Autosplitter", `${activeTab}Data`, newData);
            })
    }
</script>

<div class="wrap">
    <div class="tabs">
        {#each gamemodes as tab}
            <button class="tab" class:active={activeTab === tab}
            on:click={() => activeTab = tab}>
                {tab}
            </button>
        {/each}
        <div class="actions">
            <button on:click={exportAll}>All &#11123;</button>
            <button on:click={importAll}>All &#11121;</button>
            <button on:click={exportMode}>Mode &#11123;</button>
            <button on:click={importMode}>Mode &#11121;</button>
        </div>
    </div>

    <div class="settings-content">
        {#if activeTab === "DLD"}
            <Dld data={data.DLD} />
        {:else if activeTab === "Fishtopia"}
            <Fishtopia data={data.Fishtopia} />
        {:else if activeTab === "OneWayOut"}
            <OneWayOut data={data.OneWayOut} />
        {/if}
    </div>
</div>

<style>
    :global(div:has(> .wrap)) {
        height: 100%;
    }

    .wrap {
        height: 100%;
    }

    .settings-content {
        height: calc(100% - 40px);
        overflow-y: auto;
    }

    .tabs {
        display: flex;
        padding-left: 10px;
        gap: 10px;
        border-bottom: 1px solid gray;
        height: 37px;
    }

    .tab {
        background-color: lightgray;
        border: 1px solid gray;
        border-bottom: none;
        border-radius: 10px;
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
    }

    .tab.active {
        background-color: white;
    }

    .actions {
        height: 100%;
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .actions button {
        margin: 6px 0;
        padding: 0 8px;
        height: 25px;
        display: flex;
        align-items: center;
        justify-content: center;
        text-wrap: nowrap;
    }
</style>