import { HotkeysApi, ScopedHotkeysApi } from "./hotkeys";
import { ParcelApi, ScopedParcelApi } from "./parcel";
import NetApi, { type NetType } from "./net";
import { UIApi, ScopedUIApi } from "./ui";
import { StorageApi, ScopedStorageApi } from "./storage";
import { PatcherApi, ScopedPatcherApi } from "./patcher";

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

    constructor() {
        const id = "id";

        this.parcel = Object.freeze(new ScopedParcelApi(id));
        this.hotkeys = Object.freeze(new ScopedHotkeysApi(id));
        this.net = Object.freeze(new NetApi() as NetType);
        this.UI = Object.freeze(new ScopedUIApi());
        this.storage = Object.freeze(new ScopedStorageApi());
        this.patcher = Object.freeze(new ScopedPatcherApi(id));
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
}

Object.freeze(Api);
Object.freeze(Api.prototype);
export default Api;