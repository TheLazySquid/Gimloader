import type { State } from "$types/state";
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