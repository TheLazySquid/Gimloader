import type { Connection } from "$content/core/net/net";
import { HotkeysApi, ScopedHotkeysApi } from "./hotkeys";
import { ParcelApi, ScopedParcelApi } from "./parcel";
import { NetApi, ScopedNetApi } from "./net";
import { UIApi, ScopedUIApi } from "./ui";
import { StorageApi, ScopedStorageApi } from "./storage";
import { PatcherApi, ScopedPatcherApi } from "./patcher";
import GimkitInternals from "$content/core/internals";
import Net from "$content/core/net/net";
import UI from "$content/core/ui/ui";
import LibsApi from "./libs";
import PluginsApi from "./plugins";
import setupScoped from "$content/scopedApi";
import Parcel from "$content/core/parcel";
import Hotkeys from "$core/hotkeys.svelte";
import Patcher from "$content/core/patcher";

class Api {
    /** Functions used to modify Gimkit's internal modules */
    static parcel = Object.freeze(new ParcelApi());

    /** Functions to listen for key combinations */
    static hotkeys = Object.freeze(new HotkeysApi());

    /**
     * Ways to interact with the current connection to the server,
     * and functions to send general requests
     */
    static net = Object.freeze(new NetApi() as NetApi & Connection);

    /** Functions for interacting with the DOM */
    static UI = Object.freeze(new UIApi());

    /** Functions for persisting data between reloads */
    static storage = Object.freeze(new StorageApi());

    /** Functions for intercepting the arguments and return values of functions */
    static patcher = Object.freeze(new PatcherApi());

    /** Methods for getting info on libraries */
    static libs = Object.freeze(new LibsApi());

    /** Gets the exported values of a library */
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

    /**
     * @deprecated No longer supported
     * @hidden
     */
    static get contextMenu() { return { showContextMenu: () => {}, createReactContextMenu: () => {} } }; 

    /**
     * @deprecated No longer supported
     * @hidden
     */
    static get platformerPhysics() { return GimkitInternals.platformerPhysics };

    /**
     * @deprecated The api no longer emits events. Use GL.net.loaded to listen to load events
     * @hidden
     */
    static addEventListener(type: string, callback: () => void) {
        if(type === "loadEnd") {
            Net.on('load:*', callback);
        }
    }

    /**
     * @deprecated The api no longer emits events
     * @hidden
     */
    static removeEventListener(type: string, callback: () => void) {
        if(type === "loadEnd") {
            Net.off('load:*', callback);
        }
    }

    /**
     * @deprecated Use {@link plugins} instead
     * @hidden
     */
    static get pluginManager() { return this.plugins };

    constructor() {
        const scoped = setupScoped();
        this.onStop = scoped.onStop;
        this.openSettingsMenu = scoped.openSettingsMenu;

        this.parcel = Object.freeze(new ScopedParcelApi(scoped.id));
        this.hotkeys = Object.freeze(new ScopedHotkeysApi(scoped.id));
        this.net = Object.freeze(new ScopedNetApi(scoped.id) as ScopedNetApi & Connection);
        this.UI = Object.freeze(new ScopedUIApi(scoped.id));
        this.storage = Object.freeze(new ScopedStorageApi(scoped.id));
        this.patcher = Object.freeze(new ScopedPatcherApi(scoped.id));
        
        const netOnAny = (channel: string, ...args: any[]) => {
            this.net.emit(channel, ...args);
        }

        // emit events to the net object (not done there to allow for cleanup)
        Net.onAny(netOnAny);
        
        const cleanup = () => {
            Net.offAny(netOnAny);
            this.net.removeAllListeners();
            Parcel.stopLazy(scoped.id);
            Hotkeys.removeHotkeys(scoped.id);
            Hotkeys.removeConfigurableFromPlugin(scoped.id);
            Net.pluginOffLoad(scoped.id);
            UI.removeStyles(scoped.id);
            Patcher.unpatchAll(scoped.id);
        }
        
        this.onStop(cleanup);
    }

    /** Functions used to modify Gimkit's internal modules */
    parcel: Readonly<ScopedParcelApi>;

    /** Functions to listen for key combinations */
    hotkeys: Readonly<ScopedHotkeysApi>;

    /**
     * Ways to interact with the current connection to the server,
     * and functions to send general requests
     */
    net: Readonly<ScopedNetApi & Connection>;

    /** Functions for interacting with the DOM */
    UI: Readonly<ScopedUIApi>;

    /** Functions for persisting data between reloads */
    storage: Readonly<ScopedStorageApi>;

    /** Functions for intercepting the arguments and return values of functions */
    patcher: Readonly<ScopedPatcherApi>

    /** Methods for getting info on libraries */
    libs = Api.libs;

    /** Gets the exported values of a library */
    lib = Api.libs.get;

    /** Methods for getting info on plugins */
    plugins = Api.plugins;
    
    /** Gets the exported values of a plugin, if it has been enabled */
    plugin = Api.plugins.get;

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

    /** Run a callback when the plugin or library is disabled */
    onStop: (callback: () => void) => void;

    /**
     * Run a callback when the plugin's settings menu button is clicked
     * 
     * This function is not available for libraries
     */
    openSettingsMenu: (callback: () => void) => void;
}

Object.freeze(Api);
Object.freeze(Api.prototype);
export default Api;