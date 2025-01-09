import { HotkeysApi, ScopedHotkeysApi } from "./hotkeys";
import { ParcelApi, ScopedParcelApi } from "./parcel";
import NetApi, { type NetType } from "./net";
import { UIApi, ScopedUIApi } from "./ui";
import { StorageApi, ScopedStorageApi } from "./storage";
import { PatcherApi, ScopedPatcherApi } from "./patcher";
import LibManager from "$src/core/libManager/libManager.svelte";
import PluginManager from "$src/core/pluginManager/pluginManager.svelte";

class Api {
    /** Functions used to modify Gimkit's internal modules */
    static parcel = Object.freeze(new ParcelApi());

    /** Functions to listen for key combinations */
    static hotkeys = Object.freeze(new HotkeysApi());

    /**
     * Ways to interact with the current connection to the server,
     * and functions to send general requests
     */
    static net = Object.freeze(new NetApi() as NetType);

    /** Functions for interacting with the DOM */
    static UI = Object.freeze(new UIApi());

    /** Functions for persisting data between reloads */
    static storage = Object.freeze(new StorageApi());

    /** Functions for intercepting the arguments and return values of functions */
    static patcher = Object.freeze(new PatcherApi());

    /** Require a library, if it exists */
    static lib = LibManager.get.bind(LibManager);

    /** Require a plugin, if it exists and has been enabled */
    static plugin = PluginManager.getExports.bind(PluginManager);

    constructor() {
        const id = "id";

        this.parcel = Object.freeze(new ScopedParcelApi(id));
        this.hotkeys = Object.freeze(new ScopedHotkeysApi(id));
        this.net = Object.freeze(new NetApi() as NetType);
        this.UI = Object.freeze(new ScopedUIApi(id));
        this.storage = Object.freeze(new ScopedStorageApi(id));
        this.patcher = Object.freeze(new ScopedPatcherApi(id));
        this.lib = LibManager.get.bind(LibManager);
        this.plugin = PluginManager.getExports.bind(PluginManager);
    }

    /** Functions used to modify Gimkit's internal modules */
    parcel: Readonly<ScopedParcelApi>;

    /** Functions to listen for key combinations */
    hotkeys: Readonly<ScopedHotkeysApi>;

    /**
     * Ways to interact with the current connection to the server,
     * and functions to send general requests
     */
    net: Readonly<NetType>;

    /** Functions for interacting with the DOM */
    UI: Readonly<ScopedUIApi>;

    /** Functions for persisting data between reloads */
    storage: Readonly<ScopedStorageApi>;

    /** Functions for intercepting the arguments and return values of functions */
    patcher: Readonly<ScopedPatcherApi>

    /** Require a library, if it exists */
    lib: typeof LibManager.get;

    /** Require a plugin, if it exists and has been enabled */
    plugin: typeof PluginManager.getExports;
}

Object.freeze(Api);
Object.freeze(Api.prototype);
export default Api;