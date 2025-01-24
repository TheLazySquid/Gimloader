<script lang="ts">
    import { Button, Popover } from "flowbite-svelte";
    import Undo from 'svelte-material-icons/Undo.svelte';
    import { overrideKeydown, stopOverrideKeydown } from '$src/utils';
    import { onDestroy } from "svelte";
    import { SvelteSet } from "svelte/reactivity";
    import Hotkeys, { type ConfigurableHotkey, type HotkeyTrigger } from "$core/hotkeys.svelte";

    let hotkeys = Hotkeys.configurableHotkeys;

    let categories: Record<string, ConfigurableHotkey[]> = $derived.by(() => {
        let categories = {};
        for (let hotkey of hotkeys.values()) {
            if (!categories[hotkey.category]) {
                categories[hotkey.category] = [];
            }
            categories[hotkey.category].push(hotkey);
        }
        return categories;
    });

    let configuring: ConfigurableHotkey | null = null;

    function startConfigure(hotkey: ConfigurableHotkey) {
        configuring = hotkey;
        overrideKeydown(onKeydown);
    }

    function onKeydown(e: KeyboardEvent) {
        if(!configuring || !e.key) return;
        e.preventDefault();
        e.stopPropagation();

        if(e.key == "Escape") {
            configuring.trigger = null;
            stopConfigure();
        } else if(e.key === "Enter") {
            stopConfigure();
        } else {
            configuring.trigger = {
                key: e.code,
                ctrl: e.ctrlKey,
                alt: e.altKey,
                shift: e.shiftKey
            }
        }
    }

    function stopConfigure() {
        configuring = null;
        document.documentElement.click();
        (document.activeElement as HTMLElement)?.blur?.();
        Hotkeys.saveConfigurableHotkeys();
        stopOverrideKeydown();
    }

    function renameKey(key: string) {
        if(key === " ") return "Space";
        return key[0].toUpperCase() + key.slice(1);
    }

    function onShow(e: CustomEvent<boolean>) {
        if(e.detail) return;
        stopConfigure();
    }

    function reset(hotkey: ConfigurableHotkey, noSave = false) {
        hotkey.reset();

        if(noSave) return;
        Hotkeys.saveConfigurableHotkeys();
    }

    function resetAll() {
        if(!confirm("Are you sure you want to reset all hotkeys?")) return;
        for(let hotkey of hotkeys.values()) {
            reset(hotkey, true);
        }

        Hotkeys.saveConfigurableHotkeys();
    }

    function formatTrigger(trigger: HotkeyTrigger | null) {
        if(!trigger) return "Not Bound";
        console.log(trigger);

        let keys: string[] = [];
        if(trigger.key) {
            if(trigger.ctrl && !trigger.key.startsWith("Control")) keys.push("Ctrl");
            if(trigger.alt && !trigger.key.startsWith("Alt")) keys.push("Alt");
            if(trigger.shift && !trigger.key.startsWith("Shift")) keys.push("Shift");
    
            if(trigger.key.startsWith("Key")) keys.push(trigger.key.slice(3));
            else if(trigger.key.startsWith("Digit")) keys.push(trigger.key.slice(5));
            else keys.push(trigger.key);
        } else {
            if(trigger.ctrl && !trigger.keys.some(key => key.startsWith("Control"))) keys.push("Ctrl");
            if(trigger.alt && !trigger.keys.some(key => key.startsWith("Alt"))) keys.push("Alt");
            if(trigger.shift && !trigger.keys.some(key => key.startsWith("Shift"))) keys.push("Shift");

            for(let key of trigger.keys) {
                if(key.startsWith("Key")) keys.push(key.slice(3));
                else if(key.startsWith("Digit")) keys.push(key.slice(5));
                else keys.push(key);
            }
        }

        return keys.join(" + ");
    }

    onDestroy(stopOverrideKeydown);
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
                <Button id={hotkey.id} onclick={() => startConfigure(hotkey)}>
                    {#if hotkey.trigger === null}
                        Not Bound
                    {:else if hotkey.trigger instanceof SvelteSet}
                        {#if hotkey.trigger.size === 0}
                            Not Bound
                        {:else}
                            {Array.from(hotkey.trigger).map(renameKey).join(" + ")}
                        {/if}
                    {:else}
                        {formatTrigger(hotkey.trigger)}
                    {/if}
                </Button>
                <Popover title="Configure Hotkey" trigger="focus" on:show={onShow}>
                    Click outside or hit enter to confirm
                </Popover>
                <button onclick={() => reset(hotkey)}>
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
            <Button class="h-7" onclick={resetAll}>
                <Undo class="mr-1" />Reset All
            </Button>
        {/if}
    </div>
</div>