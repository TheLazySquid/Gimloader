import Api from "./api/api";
import Hotkeys from "$core/hotkeys/hotkeys.svelte";
import Net from "$core/net/net";
import Parcel from "$core/parcel";
import UI from "$core/ui/ui";
import GimkitInternals from "$core/internals";
import { log } from "./utils";
import Port from "$shared/port.svelte";
import Storage from "$core/storage.svelte";
import LibManager from "$core/libManager/libManager.svelte";
import PluginManager from "$core/pluginManager/pluginManager.svelte";
import { version } from "../../package.json";
import { fixRDT } from "$core/rdt";
import UpdateNotifier from "./core/updateNotifier.svelte";

Object.defineProperty(window, "GL", {
    value: Api,
    writable: false,
    configurable: false
});

Parcel.init();
UI.init();
Net.init();
GimkitInternals.init();

Port.init((state) => {
    Storage.init(state.pluginStorage, state.settings);
    LibManager.init(state.libraries);
    PluginManager.init(state.plugins);
    Hotkeys.init(state.hotkeys);
    UpdateNotifier.init(state.availableUpdates);
}, (state) => {
    log("Resynchronizing with state", state);

    Storage.updateState(state.pluginStorage, state.settings);
    LibManager.updateState(state.libraries);
    PluginManager.updateState(state.plugins);
    Hotkeys.updateState(state.hotkeys);
    UpdateNotifier.onUpdate(state.availableUpdates);
});

fixRDT();

log(`Gimloader v${version} loaded`);