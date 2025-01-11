import { HotkeysApi, ScopedHotkeysApi } from "./hotkeys";
import { ParcelApi, ScopedParcelApi } from "./parcel";
import NetApi, { type NetType } from "./net";
import { UIApi, ScopedUIApi } from "./ui";
import { StorageApi, ScopedStorageApi } from "./storage";
import { PatcherApi, ScopedPatcherApi } from "./patcher";
import LibManager from "$core/libManager/libManager.svelte";
import PluginManager from "$core/pluginManager/pluginManager.svelte";
import GimkitInternals from "$core/internals";
import Net from "$core/net/net";
import UI from "$core/ui/ui";
import LibsApi from "./libs";
import PluginsApi from "./plugins";

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

    /** Methods for getting info on libraries */
    static libs = Object.freeze(new LibsApi());

    /** Get the exported values of a library */
    static lib = this.libs.get;

    /** Methods for getting info on plugins */
    static plugins = Object.freeze(new PluginsApi());
    
    /** Gets the exported values of a plugin, if it has been enabled */
    static plugin = this.plugins.get;

    /** Gimkit's internal react instance */
    static get React() { return UI.React };

    /** Gimkit's internal reactDom instance */
    static get ReactDOM() { return UI.ReactDOM };

    /** A variety of Gimkit internal objects available in 2d gamemodes */
    static get stores() { return GimkitInternals.stores };

    /**
     * Gimkit's notification object, only available when joining or playing a game
     * 
     * {@link https://ant.design/components/notification}
     */
    static get notification() { return GimkitInternals.notification };

    /** @deprecated No longer supported */
    static get contextMenu() { return { showContextMenu: () => {}, createReactContextMenu: () => {} } }; 

    /** @deprecated The api no longer emits events. Use GL.net.loaded to listen to load events */
    static addEventListener(type: string, callback: () => void) {
        if(type === "loadEnd") {
            Net.loaded.then(callback);
        }
    }

    /** @deprecated The api no longer emits events */
    static removeEventListener() {}

    /** @deprecated Use {@link plugins} instead */
    static get pluginManager() { return this.plugins };

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

    /** Methods for getting info on libraries */
    libs = Api.libs;

    /** Get the exported values of a library */
    lib = Api.lib;

    /** Methods for getting info on plugins */
    plugins = Api.plugins;
    
    /** Gets the exported values of a plugin, if it has been enabled */
    plugin = Api.plugin;

    /** Gimkit's internal react instance */
    get React() { return UI.React };

    /** Gimkit's internal reactDom instance */
    get ReactDOM() { return UI.ReactDOM };

    /** A variety of gimkit internal objects available in 2d gamemodes */
    get stores() { return GimkitInternals.stores };

    /**
     * Gimkit's notification object, only available when joining or playing a game
     * 
     * {@link https://ant.design/components/notification}
     */
    get notification() { return GimkitInternals.notification };
}

Object.freeze(Api);
Object.freeze(Api.prototype);
export default Api;