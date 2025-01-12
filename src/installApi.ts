import { parsePluginHeader } from "$src/parseHeader";
import PluginManager from "./core/pluginManager/pluginManager.svelte";

export default function initInstallApi() {
    (unsafeWindow as any).GLInstall = async function (script: string) {
        let headers = parsePluginHeader(script);
        let existingPlugin = PluginManager.getPlugin(headers.name);
        if(existingPlugin) {
            existingPlugin.edit(script, headers);
        } else {
            PluginManager.createPlugin(script, false);
        }
    };

    (unsafeWindow as any).GLGet = function (name: string) {
        return PluginManager.getPlugin(name)?.script;
    }
}