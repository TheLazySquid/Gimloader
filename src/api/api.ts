import { HotkeysApi, ScopedHotkeysApi } from "./hotkeys";
import { ParcelApi, ScopedParcelApi } from "./parcel";
import NetApi, { type NetType } from "./net";
import { UIApi, ScopedUIApi } from "./ui";
import { StorageApi, ScopedStorageApi } from "./storage";

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

    constructor() {
        this.parcel = new ScopedParcelApi();
        this.hotkeys = new ScopedHotkeysApi();
        this.net = new NetApi() as NetType;
        this.UI = new ScopedUIApi();
        this.storage = new ScopedStorageApi();
    }

    /** Functions used to modify Gimkit's internal modules */
    parcel: ScopedParcelApi;

    /** Functions to listen for key combinations */
    hotkeys: ScopedHotkeysApi;

    /**
     * Ways to interact with the current connection to the server,
     * and functions to send general requests
     */
    net: NetType;

    /** Functions for interacting with the DOM */
    UI: ScopedUIApi;

    /** Functions for persisting data between reloads */
    storage: ScopedStorageApi;
}

Object.freeze(Api);
Object.freeze(Api.prototype);
export default Api;