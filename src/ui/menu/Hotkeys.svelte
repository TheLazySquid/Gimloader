<script lang="ts">
    import type HotkeyManager from "../../hotkeyManager/hotkeyManager";
    import type { EasyAccessWritable, IConfigurableHotkey } from "../../types";
    import { Button, Popover } from "flowbite-svelte";
    import Undo from 'svelte-material-icons/Undo.svelte';

    export let hotkeyManager: HotkeyManager;
    let hotkeys: EasyAccessWritable<Map<string, IConfigurableHotkey>> = hotkeyManager.configurableHotkeys;

    let categories: Record<string, IConfigurableHotkey[]> = {};
    $: {
        categories = {};
        for (let hotkey of $hotkeys.values()) {
            if (!categories[hotkey.category]) {
                categories[hotkey.category] = [];
            }
            categories[hotkey.category].push(hotkey);
        }
    }

    let configuring: IConfigurableHotkey | null = null;
    let configureClear = true;

    function startConfigure(hotkey: IConfigurableHotkey) {
        configuring = hotkey;
        configureClear = true;
    }

    function onKeydown(e: KeyboardEvent) {
        if(!configuring || !e.key) return;
        e.preventDefault();
        e.stopPropagation();

        if(configureClear) {
            configuring.keys.clear();
            configureClear = false;
        }

        if(e.key == "Escape") {
            configuring.keys.clear();
            stopConfigure();
        } else if(e.key === "Enter") {
            stopConfigure();
        } else {
            configuring.keys.add(e.key.toLowerCase());
        }

        hotkeys.update();
    }

    function stopConfigure() {
        configuring = null;
        document.documentElement.click();
        (document.activeElement as HTMLElement)?.blur?.();
        hotkeyManager.saveConfigurableHotkeys();
    }

    function renameKey(key: string) {
        if(key === " ") return "Space";
        return key[0].toUpperCase() + key.slice(1);
    }

    function onShow(e: CustomEvent<boolean>) {
        if(e.detail) return;
        stopConfigure();
    }

    function reset(hotkey: IConfigurableHotkey, noSave = false) {
        if(hotkey.defaultKeys) {
            hotkey.keys = new Set(hotkey.defaultKeys);
        } else {
            hotkey.keys = new Set();
        }

        if(noSave) return;
        hotkeys.update();
        hotkeyManager.saveConfigurableHotkeys();
    }

    function resetAll() {
        if(!confirm("Are you sure you want to reset all hotkeys?")) return;
        for(let hotkey of $hotkeys.values()) {
            reset(hotkey, true);
        }

        hotkeys.update();
        hotkeyManager.saveConfigurableHotkeys();
    }
</script>

<div class="flex flex-col">
    <div class="flex-grow overflow-y-auto grid gap-x-5 gap-y-1 pb-1"
    style="grid-template-columns: auto auto auto 1fr;">
        {#if Object.keys(categories).length === 0}
            <h1 class="col-span-4 text-center font-bold text-3xl pt-5">There aren't any hotkeys!</h1>
            <h2 class="col-span-4 text-center text-xl">Some plugins will add hotkeys that can be changed here.</h2>
        {/if}
        {#each Object.entries(categories) as [category, hotkeys], i}
            <h2 class="text-xl font-bold col-span-4 border-b border-gray-200">{category}</h2>
            {#each hotkeys as hotkey}
                <div class="flex items-center">
                    {hotkey.title}
                </div>
                <Button id={hotkey.id} on:click={() => startConfigure(hotkey)} on:keydown={onKeydown}>
                    {#if hotkey.keys.size === 0}
                        Not Bound
                    {:else}
                        {Array.from(hotkey.keys).map(renameKey).join(" + ")}
                    {/if}
                </Button>
                <Popover title="Configure Hotkey" trigger="focus" on:show={onShow}>
                    Click outside or hit enter to confirm
                </Popover>
                <button on:click={() => reset(hotkey)}>
                    <Undo />
                </button>
                <div></div>
            {/each}
            {#if i > 0}
                <div class="h-px bg-gray-200 col-span-4"></div>
            {/if}
        {/each}
    </div>
    <div>
        {#if Object.keys(categories).length > 0}
            <Button class="h-7" on:click={resetAll}>
                <Undo class="mr-1" />Reset All
            </Button>
        {/if}
    </div>
</div>