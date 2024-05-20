import { type Plugin } from '../loadPlugins';
export declare function checkScriptUpdate(): Promise<void>;
export declare function checkPluginUpdate(plugin: Plugin, rerender: () => void): Promise<void>;
