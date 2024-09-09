import type { Gimloader } from "$src/gimloader";
import debounce from "debounce";
import Plugin from "./plugin";
export default class PluginManager {
    gimloader: Gimloader;
    plugins: import("../types").EasyAccessWritable<Plugin[]>;
    runPlugins: boolean;
    constructor(gimloader: Gimloader, runPlugins?: boolean);
    init(): Promise<void>;
    saveFn(): void;
    saveDebounced: debounce.DebouncedFunction<() => void>;
    save(newPlugins?: Plugin[]): void;
    getPlugin(name: string): Plugin;
    isEnabled(name: string): boolean;
    createPlugin(script: string): Promise<void>;
    deletePlugin(plugin: Plugin): void;
    enableAll(): void;
    disableAll(): void;
}
