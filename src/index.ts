import Api from "./api/api";
import Hotkeys from "$core/hotkeys.svelte";
import Net from "$core/net/net";
import Parcel from "$core/parcel";
import UI from "$core/ui/ui";
import GimkitInternals from "$core/internals";
import Poller from "$src/core/poller.svelte";
import initInstallApi from "./installApi";
import Storage from "$core/storage";
import LibManager from "$core/libManager/libManager.svelte";
import PluginManager from "$core/pluginManager/pluginManager.svelte";
import { onGimkit } from "./utils";

Object.defineProperty(unsafeWindow, "GL", {
    value: Api,
    writable: false,
    configurable: false
});

if(onGimkit) {
    Parcel.init();
    UI.init();
    Net.init();
    Hotkeys.init();
    GimkitInternals.init();
    Poller.init();
} else {
    initInstallApi();
}

GM.registerMenuCommand("Wipe All Plugins and Libraries", () => {
    if(!confirm("Do you really want to delete all plugins and libraries? This will also reload the page.")) return;

    Storage.setValue("plugins", '[]');
    Storage.setValue("libs", []);
    LibManager.destroyed = true;
    PluginManager.destroyed = true;

    location.reload();
});