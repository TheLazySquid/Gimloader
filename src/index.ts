import Api from "./api/api";
import Hotkeys from "$core/hotkeys.svelte";
import Net from "$core/net/net";
import Parcel from "$core/parcel";
import UI from "$core/ui/ui";
import GimkitInternals from "$core/internals";
import Poller from "$src/core/poller.svelte";
import initInstallApi from "./installApi";

Object.defineProperty(unsafeWindow, "GL", {
    value: Api,
    writable: false,
    configurable: false
});

Parcel.init();
UI.init();
Net.init();
Hotkeys.init();
GimkitInternals.init();
Poller.init();

initInstallApi();