import type Plugin from '../pluginManager/plugin';
export declare function checkScriptUpdate(): Promise<void>;
export declare function checkPluginUpdate(plugin: Plugin): Promise<void>;
