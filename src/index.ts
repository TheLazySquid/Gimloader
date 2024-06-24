import { Gimloader } from "./gimloader";
import initInstallApi from "./installApi";
import { onGimkit } from "./util";

let loader = new Gimloader();
window.GL = loader;
unsafeWindow.GL = loader;

if(!onGimkit) {
    loader.pluginManager.init();
}

if(location.host === "thelazysquid.github.io" && location.pathname === "/gimloader/") {
    initInstallApi(loader);
}