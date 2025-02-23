import PluginManager from "$core/pluginManager/pluginManager.svelte";
import { validate } from "$content/utils";

class PluginsApi {
    /** A list of all the plugins installed */
    get list() { return PluginManager.getPluginNames() };

    /** Whether a plugin exists and is enabled */
    isEnabled(name: string) {
        if(!validate("plugins.isEnabled", arguments, ['name', 'string'])) return;
        
        return PluginManager.isEnabled(name);  
    }
    
    /** Gets the headers of a plugin, such as version, author, and description */
    getHeaders(name: string) {
        if(!validate("plugins.getHeaders", arguments, ['name', 'string'])) return;

        return PluginManager.getHeaders(name);
    }

    /** Gets the exported values of a plugin, if it has been enabled */
    get(name: string) {
        return PluginManager.getExports(name);
    }

    /** 
     * @deprecated Use {@link get} instead
     * @hidden
     */
    getPlugin(name: string) {
        return { return: PluginManager.getExports(name) };
    }
}

Object.freeze(PluginsApi);
Object.freeze(PluginsApi.prototype);
export default PluginsApi;