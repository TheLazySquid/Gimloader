<script lang="ts">
    import type { NumberEl, QSElement } from "./types";
    import Toggle from "svelte-toggle";

    export let name: string;
    export let els: QSElement[];
    export let settings: Record<string, any>;
    $: GL.storage.setValue(name, "QS-Settings", settings);

    function clampNum(value: number, el: NumberEl) {
        if(el.step) value = Math.round(value / el.step) * el.step;
        if(el.min) value = Math.max(value, el.min);
        if(el.max) value = Math.min(value, el.max);

        return value;
    }
</script>

<div class="settings">
    {#each els as el}
        {#if el.type === "heading"}
            <h2>{ el.text }</h2>
        {:else if el.type === "boolean"}
            <div class="setting">
                <div class="text">
                    {el.title}
                </div>
                <Toggle hideLabel bind:toggled={settings[el.id]}
                on:toggle={() => settings.onChange(el.id)} />
            </div>
        {:else if el.type === "number"}
            <div class="setting">
                <div class="text">
                    {el.title}
                </div>
                <input bind:value={settings[el.id]} type="number"
                on:change={() => {
                    settings[el.id] = clampNum(settings[el.id], el);
                    settings.onChange(el.id);
                }}
                min={el.min} max={el.max} step={el.step} />
            </div>
        {:else if el.type === "text"}
            <div class="setting">
                <div class="text">
                    {el.title}
                </div>
                <input bind:value={settings[el.id]} type="text"
                on:change={() => settings.onChange(el.id)}
                maxlength={el.maxLength} />
            </div>
        {:else if el.type === "dropdown"}
            <div class="setting">
                <div class="text">
                    {el.title}
                </div>
                <select bind:value={settings[el.id]} on:change={() => settings.onChange(el.id)}>
                    {#each el.options as option}
                        <option value={option}>{option}</option>
                    {/each}
                </select>
            </div>
        {/if}
    {/each}
</div>

<style>
    h2 {
        font-weight: bold;
        border-bottom: 2px solid darkgray;
        margin-bottom: 0;
    }

    .settings {
        display: flex;
        flex-direction: column;
        gap: 5px;
    }

    .text {
        flex-grow: 1;
    }

    .setting {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 17px;
        text-wrap: nowrap;
        padding-bottom: 2px;
        padding-right: 3px;
    }

    .setting:not(:last-child) {
        border-bottom: 1px solid darkgray;
    }

    input {
        height: 25px;
        border-radius: 5px;
        width: 140px;
    }
</style>