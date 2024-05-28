import Plugin from "./plugin";
export default class PluginManager {
    plugins: Plugin[];
    runPlugins: boolean;
    reactSetPlugins?: (plugins: Plugin[]) => void;
    updatePluginTimeout: any;
    constructor(runPlugins?: boolean);
    updatePlugins(): void;
    init(): Promise<void>;
    save(newPlugins: Plugin[]): void;
    getPlugin(name: string): Plugin;
    isEnabled(name: string): boolean;
    createPlugin(script: string): void;
    deletePlugin(plugin: Plugin): void;
    setAll(enabled: boolean): void;
}