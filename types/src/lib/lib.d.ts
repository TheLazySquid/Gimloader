export default class Lib {
    script: string;
    library: any;
    headers: Record<string, any>;
    enabling: boolean;
    enableError?: Error;
    enableSuccessCallbacks: (() => void)[];
    enableFailCallbacks: ((e: any) => void)[];
    usedBy: Set<string>;
    constructor(script: string, headers?: Record<string, any>);
    enable(): Promise<void>;
    addUsed(pluginName: string): void;
    removeUsed(pluginName: string): void;
    disable(): void;
}
