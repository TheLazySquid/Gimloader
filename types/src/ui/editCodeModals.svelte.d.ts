import PluginManager from "../pluginManager/pluginManager.svelte";
import Plugin from "../pluginManager/plugin.svelte";
import Lib from "$src/lib/lib";
import type { LibManagerClass } from "$src/lib/libManager.svelte";
export declare function showPluginCodeEditor(plugin: Plugin, pluginManager: PluginManager): void;
export declare function createPlugin(pluginManager: PluginManager): void;
export declare function showLibCodeEditor(lib: Lib, libManager: LibManagerClass): void;
export declare function createLib(libManager: LibManagerClass): void;
