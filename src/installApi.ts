import { Gimloader } from "./gimloader.svelte";
import { parsePluginHeader } from "./util";

export default function initInstallApi(loader: Gimloader) {
    (unsafeWindow as any).GLInstall = async function (script: string) {
        let headers = parsePluginHeader(script);
        let existingPlugin = loader.pluginManager.getPlugin(headers.name);
        if(existingPlugin) {
            existingPlugin.edit(script, headers);
        } else {
            loader.pluginManager.createPlugin(script, false);
        }
    };

    (unsafeWindow as any).GLGet = function (name: string) {
        return loader.pluginManager.getPlugin(name)?.script;
    }
}