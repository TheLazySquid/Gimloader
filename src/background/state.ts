import type { LibraryInfo, PluginInfo, State } from "$types/state";
import debounce from "debounce";

export let statePromise = chrome.storage.local.get<State>({
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

statePromise.then((state) => {
    removeDupes(state.plugins);
    removeDupes(state.libraries);
});

let debounced: Record<string, () => void> = {};

export async function saveDebounced(key: keyof State) {
    let state = await statePromise;

    // debounce just to be safe
    if(!debounced[key]) {
        debounced[key] = debounce(() => {
            chrome.storage.local.set({ [key]: state[key] })
        }, 100);
    }

    debounced[key]();
}