import { Gimloader } from "./gimloader";
import initInstallApi from "./installApi";
import { getUnsafeWindow} from "./util";

if(location.host === "www.gimkit.com") {
    let loader = new Gimloader();
    window.GL = loader;
    getUnsafeWindow().GL = loader;
} else if(location.host === "thelazysquid.github.io" && location.pathname === "/gimloader/") {
    initInstallApi();
}