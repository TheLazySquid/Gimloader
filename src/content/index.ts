import Api from "./api/api";
import Net from "$core/net/net";
import Parcel from "$core/parcel";
import UI from "$core/ui/ui";
import GimkitInternals from "$core/internals";
import { log } from "./utils";
import Port from "$shared/port.svelte";
import { version } from "../../package.json";
import { fixRDT } from "$core/rdt";
import StateManager from "$core/state";

Object.defineProperty(window, "GL", {
    value: Api,
    writable: false,
    configurable: false
});

Parcel.init();
UI.init();
Net.init();
GimkitInternals.init();
StateManager.init();

Port.init((state) => {
    StateManager.initState(state);
}, (state) => {
    log("Resynchronizing with state", state);
    StateManager.syncWithState(state);
});

fixRDT();

log(`Gimloader v${version} loaded`);