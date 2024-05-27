import type PluginManager from "./pluginManager";
export default class Plugin {
    script: string;
    pluginManager: PluginManager;
    enabled: boolean;
    headers: Record<string, string>;
    return: any;
    runPlugin: boolean;
    constructor(script: string, pluginManager: PluginManager, enabled?: boolean, initial?: boolean, runPlugin?: boolean);
    enable(initial?: boolean): Promise<void>;
    disable(): void;
    edit(script: string, headers: Record<string, string>): void;
}
