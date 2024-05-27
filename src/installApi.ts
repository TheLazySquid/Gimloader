import parseHeader from "./pluginManager/parseHeader";
import PluginManager from "./pluginManager/pluginManager";

export default function initInstallApi() {
    // create a new plugin manager that doesn't run plugins
    let pluginManager = new PluginManager(false);
    pluginManager.init();

    (unsafeWindow as any).GLInstall = function (script: string) {
        let headers = parseHeader(script);
        let existingPlugin = pluginManager.getPlugin(headers.name);
        if(existingPlugin) {
            existingPlugin.edit(script, headers);
        }
        
        pluginManager.createPlugin(script);
    };

    (unsafeWindow as any).GLGet = function (name: string) {
        return pluginManager.getPlugin(name)?.script;
    }
}