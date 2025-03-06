<script lang="ts">
    import CustomServer from "$content/core/customServer.svelte";
    import { Toggle } from "flowbite-svelte";

    let isAddressValid = $derived.by(() => {
        let address = CustomServer.config.address.trim();

        if(!address.startsWith("http://") && !address.startsWith("https://")) {
            address = "http://" + address;
        }

        let site = address.slice(address.indexOf("://") + 3);
        if(site.includes(":") || site.includes("/") || site.includes(" ")) return false;
        
        try {
            new URL(address);
            return true;
        } catch {
            return false;
        }
    });
</script>

<h1 class="text-xl font-bold">Custom Server</h1>
<div class="flex items-center text-xl gap-2">
    <Toggle bind:checked={CustomServer.config.enabled} on:change={() => CustomServer.save()} />
    Enable Custom Server
</div>

<div class="mt-1 {CustomServer.config.enabled ? "" : "opacity-50 pointer-events-none"}">
    <div class="flex items-center gap-2 text-xl"> 
        <input class="{isAddressValid ? "border-b border-x-0 border-t-0 border-gray-700" : "!outline-2 outline outline-red-600"}
        w-[200px] pl-2 text-lg" bind:value={CustomServer.config.address}
        onchange={() => CustomServer.save()} placeholder="..." />
        Server Address
    </div>
    <h1 class="font-bold text-xl mt-3">Advanced Settings</h1>
    <div class="text-sm">You shouldn't touch these unless you know what you're doing</div>
    <div class="text-xl flex items-center gap-2">
        <select class="border-b border-x-0 border-t-0 border-gray-700 w-[200px] text-lg"
        bind:value={CustomServer.config.type} onchange={() => CustomServer.save()}>
            <option value="game">Game</option>
            <option value="all">Game + API</option>
        </select>
        Server Type
    </div>
    <div class="flex items-center gap-2 text-xl mt-1"> 
        <input class="border-b border-x-0 border-t-0 border-gray-700 w-[200px] text-lg"
        type="number" placeholder="5823" bind:value={CustomServer.config.port} onchange={() => CustomServer.save()} />
        API Port
    </div>
</div>