import { parsePluginHeader } from "$src/parseHeader";
import PluginManager from "./core/pluginManager/pluginManager.svelte";
import Storage from "$core/storage";

export default function initInstallApi() {
    (unsafeWindow as any).GLInstall = async function (script: string) {
        let headers = parsePluginHeader(script);
        let plugins = PluginManager.getPluginInfo();

        let existing = plugins.find(p => p.name === headers.name);

        if(existing) {
            existing.script = script;
        } else {
            plugins.push({ script, name: headers.name, enabled: true });
        }

        Storage.setValue("plugins", plugins);
    };

    (unsafeWindow as any).GLGet = function (name: string) {
        let plugins = PluginManager.getPluginInfo();
        return plugins.find(p => p.name === name)?.script;
    }
}