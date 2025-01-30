import Api from "./api/api";
import Hotkeys from "$core/hotkeys.svelte";
import Net from "$content/core/net/net";
import Parcel from "$content/core/parcel";
import UI from "$content/core/ui/ui";
import GimkitInternals from "$content/core/internals";
import { log } from "./utils";
import Port from "$shared/port";
import Storage from "$content/core/storage.svelte";
import LibManager from "$core/libManager/libManager.svelte";
import PluginManager from "$core/pluginManager/pluginManager.svelte";
import { version } from "../../package.json";

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
    console.log(state.plugins);
    Storage.init(state.pluginStorage, state.settings);
    LibManager.init(state.libraries);
    PluginManager.init(state.plugins);
    Hotkeys.init(state.hotkeys);
});

log(`Gimloader v${version} loaded`);