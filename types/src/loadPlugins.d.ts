export declare class Plugin {
    script: string;
    enabled: boolean;
    headers: Record<string, string>;
    return: any;
    constructor(script: string, enabled?: boolean, initial?: boolean);
    enable(initial?: boolean): Promise<void>;
    disable(): void;
}
export declare let plugins: Plugin[];
export declare function initPlugins(): Promise<void>;
export declare function savePlugins(newPlugins: Plugin[]): void;
export declare function parseHeader(code: string): Record<string, string>;
