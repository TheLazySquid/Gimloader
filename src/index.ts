import { Gimloader } from "./gimloader";
import initInstallApi from "./installApi";

let loader = new Gimloader();
window.GL = loader;
unsafeWindow.GL = loader;

if(location.host === "thelazysquid.github.io" && location.pathname === "/gimloader/") {
    initInstallApi(loader);
}