import type { LibraryInfo, PluginInfo, State } from "$types/state";
import debounce from "debounce";

export let state = chrome.storage.local.get<State>({
    plugins: [],
    libraries: [],
    pluginStorage: {},
    settings: {
        pollerEnabled: false,
        autoUpdate: false,
        autoDownloadMissingLibs: true,
        menuView: 'grid',
        showPluginButtons: true
    },
    hotkeys: {}
});

// double check that there are no duplicate plugins or libraries
const removeDupes = (items: PluginInfo[] | LibraryInfo[]) => {
    for(let i = 0; i < items.length - 1; i++) {
        let name = items[i].name;
        for(let j = i + 1; j < items.length; j++) {
            if(items[j].name === name) {
                items.splice(i, 1);
                i--;
                console.warn(`Duplicate item ${name}`);
                break;
            }
        }
    }
}

state.then((state) => {
    removeDupes(state.plugins);
    removeDupes(state.libraries);
});

let debounced: Record<string, () => void> = {};

export function saveDebounced(key: keyof State) {
    // debounce just to be safe
    if(!debounced[key]) {
        debounced[key] = debounce(async () => {
            chrome.storage.local.set({ [key]: (await state)[key] })
        }, 100);
    }

    debounced[key]();
}