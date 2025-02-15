import type { LibraryInfo, PluginInfo, SavedState, State } from "$types/state";
import debounce from "debounce";

export let statePromise = new Promise<State>(async (res) => {
    let savedState = await chrome.storage.local.get<SavedState>({
        plugins: [],
        libraries: [],
        pluginStorage: {},
        settings: {
            pollerEnabled: false,
            autoUpdate: true,
            autoDownloadMissingLibs: true,
            menuView: 'grid',
            showPluginButtons: true
        },
        hotkeys: {}
    });

    res({ ...savedState, availableUpdates: [] });
});

const sanitize = (items: PluginInfo[] | LibraryInfo[]) => {
    // remove any non-objects that somehow snuck in
    for(let i = 0; i < items.length; i++) {
        if(
            items[i] === null ||
            typeof items[i] !== "object" ||
            items[i].name === undefined ||
            items[i].script === undefined
        ) {
            items.splice(i, 1);
            i--;
        }
    }

    // remove any duplicates
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
    sanitize(state.plugins);
    sanitize(state.libraries);
    console.log(state);
});

let debounced: Record<string, () => void> = {};

export function saveDebounced(key: keyof SavedState) {
    // debounce just to be safe
    if(!debounced[key]) {
        debounced[key] = debounce(async () => {
            chrome.storage.local.set({ [key]: (await statePromise)[key] })
        }, 100);
    }

    debounced[key]();
}