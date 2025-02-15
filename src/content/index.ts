import Api from "./api/api";
import Hotkeys from "$core/hotkeys/hotkeys.svelte";
import Net from "$content/core/net/net";
import Parcel from "$content/core/parcel";
import UI from "$content/core/ui/ui";
import GimkitInternals from "$content/core/internals";
import { log } from "./utils";
import Port from "$shared/port.svelte";
import Storage from "$content/core/storage.svelte";
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
});

fixRDT();

log(`Gimloader v${version} loaded`);