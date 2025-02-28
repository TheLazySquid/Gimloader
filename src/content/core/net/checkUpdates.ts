import type Lib from "$core/libManager/lib.svelte";
import type Plugin from '../pluginManager/plugin.svelte';
import toast from "svelte-5-french-toast";
import Port from "$shared/port.svelte";
import type { UpdateResponse } from "$types/updater";

export async function checkPluginUpdate(plugin: Plugin) {
    let updated: UpdateResponse = await Port.sendAndRecieve("updateSingle", {
        type: "plugin",
        name: plugin.headers.name
    });

    onUpdated(plugin.headers.name, updated);
}

export async function checkLibUpdate(lib: Lib) {
    let updated: UpdateResponse = await Port.sendAndRecieve("updateSingle", {
        type: "library",
        name: lib.headers.name
    });

    onUpdated(lib.headers.name, updated);
}

function onUpdated(name: string, updated: UpdateResponse) {
    if(updated.updated) {
        if(updated.version) toast.success(`Updated ${name} to the latest version`);
        else toast.success(`Updated ${name} to v${updated.version}`);
    } else {
        if(updated.failed) {
            toast.error(`Failed to fetch the update for ${name}`);
        } else {
            toast.success(`${name} is already up to date`);
        }
    }
}