import type { Gimloader } from "$src/gimloader";
import Plugin from "./plugin";
export default class PluginManager {
    gimloader: Gimloader;
    plugins: Plugin[];
    runPlugins: boolean;
    reactSetPlugins?: (plugins: Plugin[]) => void;
    updatePluginTimeout: any;
    constructor(gimloader: Gimloader, runPlugins?: boolean);
    updatePlugins(): void;
    init(): Promise<void>;
    save(newPlugins?: Plugin[]): void;
    getPlugin(name: string): Plugin;
    isEnabled(name: string): boolean;
    createPlugin(script: string): Promise<void>;
    deletePlugin(plugin: Plugin): void;
    enableAll(): void;
    disableAll(): void;
}
