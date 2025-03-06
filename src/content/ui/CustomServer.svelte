<script lang="ts">
    import CustomServer from "$content/core/customServer.svelte";
    import { Toggle, Button } from "flowbite-svelte";
    import toast from "svelte-5-french-toast";

    let needsSave = $state(false);

    function save() {
        CustomServer.save();
        needsSave = false;
    }
</script>

<h1 class="text-xl font-bold">Custom Server</h1>
<div class="flex items-center text-xl gap-2">
    <Toggle bind:checked={CustomServer.config.enabled} on:change={() => needsSave = true} />
    Enable Custom Server
</div>

<div class="mt-1 {CustomServer.config.enabled ? "" : "opacity-50 pointer-events-none"}">
    <div class="flex items-center text-xl"> 
        <input class="border-b border-x-0 border-t-0 border-gray-700 w-[170px] pl-2"
        bind:value={CustomServer.config.address} oninput={() => needsSave = true} placeholder="..." />
        Server Address
    </div>
    <h1 class="font-bold text-xl mt-3">Advanced Settings</h1>
    <div class="text-sm">You shouldn't touch these unless you know what you're doing</div>
    <div class="text-xl flex items-center gap-2">
        <select class="border-b border-x-0 border-t-0 border-gray-700 w-[170px]"
        bind:value={CustomServer.config.type} onchange={() => needsSave = true}>
            <option value="game">Game</option>
            <option value="all">Game + API</option>
        </select>
        Server Type
    </div>
    <div class="flex items-center gap-2 text-xl mt-1"> 
        <input class="border-b border-x-0 border-t-0 border-gray-700 w-[170px]"
        type="number" placeholder="5823" bind:value={CustomServer.config.port} oninput={() => needsSave = true} />
        API Port
    </div>
</div>

<Button onclick={() => save()}
class="mt-2 {needsSave ? "" : "opacity-50 pointer-events-none"}">
    Save
</Button>