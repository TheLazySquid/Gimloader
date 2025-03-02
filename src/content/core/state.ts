import type { State } from "$types/state";
import Storage from "$core/storage.svelte";
import LibManager from "$core/libManager/libManager.svelte";
import PluginManager from "$core/pluginManager/pluginManager.svelte";
import Hotkeys from "$core/hotkeys/hotkeys.svelte";
import UpdateNotifier from "$core/updateNotifier.svelte";
import Port from "$shared/port.svelte";
import { readUserFile } from "$content/utils";
import toast from "svelte-5-french-toast";

export default class StateManager {
    static init() {
        Port.on("setState", (state: State) => {
            this.syncWithState(state);
            toast.success("New config loaded!");
        });
    }

    static syncWithState(state: State) {
        Storage.updateState(state.pluginStorage, state.settings);
        LibManager.updateState(state.libraries);
        PluginManager.updateState(state.plugins);
        Hotkeys.updateState(state.hotkeys);
        UpdateNotifier.onUpdate(state.availableUpdates);
    }

    static async downloadState() {
        let state = await Port.sendAndRecieve("getState");
        delete state.availableUpdates;

        let blob = new Blob([ JSON.stringify(state, null, 4) ], { type: "application/json" });
        let url = URL.createObjectURL(blob);
        let link = document.createElement("a");
        link.download = "gimloader_config.json";
        link.href = url;
        link.click();

        URL.revokeObjectURL(url);
    }

    static async loadState(e: MouseEvent) {
        if(!e.isTrusted) return;
        if(!confirm("Do you want to load a new config? You will lose everything, including plugins, libraries, settings, and hotkeys.")) return;

        readUserFile(".json").then((text) => {
            try {
                let state = JSON.parse(text);
                let { plugins, libraries, pluginStorage, settings, hotkeys, ...rest } = state;

                // confirm that at least one of the keys is present
                if(!plugins && !libraries && !pluginStorage && !settings && !hotkeys) {
                    toast.error("That config appears to be invalid!");
                    return;
                }

                // warn if there are extra keys
                if(Object.keys(rest).length > 0) {
                    toast("That config may be invalid, attempting to load anyways...");
                }

                Port.send("setState", { plugins, libraries, pluginStorage, settings, hotkeys });
            } catch {
                toast.error("That config appears to be invalid!");
            }
        }, () => {});
    }
}