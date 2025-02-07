import PluginManager from "$core/pluginManager/pluginManager.svelte";
import LibManager from "$core/libManager/libManager.svelte";

export const uuidRegex = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi;

interface ScopedInfo {
    id: string;
    onStop: (cb: () => void) => void;
    openSettingsMenu?: (cb: () => void) => void;
}

export default function setupScoped(): ScopedInfo {
    let stack = new Error().stack;

    // get the uuid of the blob that called this function
    let matches = stack.matchAll(uuidRegex);
    let match: RegExpExecArray;
    for(let newMatch of matches) match = newMatch;
    if(!match) throw new Error("new GL() needs to be called by a plugin!");

    let uuid = match[0];

    for(let plugin of PluginManager.plugins) {
        if(plugin.blobUuid === uuid) {
            return {
                id: plugin.headers.name,
                onStop: (cb: () => void) => plugin.onStop.push(cb),
                openSettingsMenu: (cb: () => void) => plugin.openSettingsMenu.push(cb)
            };
        }
    }

    for(let library of LibManager.libs) {
        if(library.blobUuid === uuid) {
            return {
                id: library.headers.name,
                onStop: (cb: () => void) => library.onStop.push(cb)
            };
        }
    }

    throw new Error("new GL() called outside of a plugin enabling");
}