import { HotkeysApi, ScopedHotkeysApi } from "./hotkeys";
import { ParcelApi, ScopedParcelApi } from "./parcel";
import { type NetType } from "./net";
import { UIApi, ScopedUIApi } from "./ui";
import { StorageApi, ScopedStorageApi } from "./storage";
declare class Api {
    /** Functions used to modify Gimkit's internal modules */
    static parcel: Readonly<ParcelApi>;
    /** Functions to listen for key combinations */
    static hotkeys: Readonly<HotkeysApi>;
    /**
     * Ways to interact with the current connection to the server,
     * and functions to send general requests
     */
    static net: Readonly<NetType>;
    /** Functions for interacting with the DOM */
    static UI: Readonly<UIApi>;
    /** Functions for persisting data between reloads */
    static storage: Readonly<StorageApi>;
    constructor();
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
export default Api;
