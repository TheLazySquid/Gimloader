import { Gimloader } from "./gimloader";
import { getUnsafeWindow, getValue, setValue } from "./util";

if(location.host === "www.gimkit.com") {
    let loader = new Gimloader();
    window.GL = loader;
    getUnsafeWindow().GL = loader;
} else if(location.host === "thelazysquid.github.io" && location.pathname === "/gimloader/") {
    let pluginScripts = JSON.parse(getValue('plugins', '[]')!);

    (getUnsafeWindow() as any).GLInstall = function (script: string) {
        pluginScripts.push({ script, enabled: true });
        setValue('plugins', JSON.stringify(pluginScripts));
    }
}