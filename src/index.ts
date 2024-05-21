import { Gimloader } from "./gimloader";
import initInstallApi from "./installApi";

if(location.host === "www.gimkit.com") {
    let loader = new Gimloader();
    window.GL = loader;
    unsafeWindow.GL = loader;
} else if(location.host === "thelazysquid.github.io" && location.pathname === "/gimloader/") {
    initInstallApi();
}