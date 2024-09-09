import PluginManager from "../pluginManager/pluginManager";
import Plugin from "../pluginManager/plugin";
import type { LibManagerType } from "$src/lib/libManager";
import Lib from "$src/lib/lib";
export declare function showPluginCodeEditor(plugins: Plugin[], plugin: Plugin, pluginManager: PluginManager): void;
export declare function createPlugin(pluginManager: PluginManager): void;
export declare function showLibCodeEditor(lib: Lib, libManager: LibManagerType): void;
export declare function createLib(libManager: LibManagerType): void;
