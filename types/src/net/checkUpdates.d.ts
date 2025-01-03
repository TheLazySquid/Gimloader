import type { Gimloader } from '$src/gimloader.svelte';
import type Lib from '$src/lib/lib';
import type Plugin from '../pluginManager/plugin.svelte';
export declare const scriptUrl = "https://raw.githubusercontent.com/TheLazySquid/Gimloader/main/build/bundle.user.js";
export declare function checkScriptUpdate(gimloader: Gimloader, manual: boolean): Promise<void>;
export declare function checkPluginUpdate(plugin: Plugin): Promise<void>;
export declare function checkLibUpdate(lib: Lib): Promise<void>;
export declare function compareVersions(v1: string, v2: string): 'same' | 'newer' | 'older';
