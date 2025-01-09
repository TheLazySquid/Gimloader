import Api from "./api/api";
import Hotkeys from "$core/hotkeys.svelte";
import Net from "$core/net/net";
import Parcel from "$core/parcel";
import UI from "$core/ui/ui";
import styles from "./css/styles.scss";
import initInstallApi from "./installApi";
import PluginManager from "./core/pluginManager/pluginManager.svelte";

Object.defineProperty(unsafeWindow, "GL", {
    value: Api,
    writable: false,
    configurable: false
});

Parcel.init();
UI.init();
Net.init();
Hotkeys.init();
PluginManager.init();
initInstallApi();

UI.addStyles(null, styles);