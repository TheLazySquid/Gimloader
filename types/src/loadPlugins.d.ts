export declare class Plugin {
    script: string;
    enabled: boolean;
    headers: Record<string, string>;
    return: any;
    constructor(script: string, enabled?: boolean, initial?: boolean);
    enable(initial?: boolean): Promise<void>;
    disable(): void;
}
export default class PluginManager {
    plugins: Plugin[];
    constructor();
    init(): Promise<void>;
    save(newPlugins: Plugin[]): void;
    getPlugin(name: string): Plugin;
    isEnabled(name: string): boolean;
}
export declare function parseHeader(code: string): Record<string, string>;
