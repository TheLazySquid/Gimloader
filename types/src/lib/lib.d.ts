import type { Gimloader } from "$src/gimloader";
export default class Lib {
    gimloader: Gimloader;
    script: string;
    library: any;
    headers: Record<string, any>;
    enabling: boolean;
    enableError?: Error;
    enableSuccessCallbacks: ((needsReload: boolean) => void)[];
    enableFailCallbacks: ((e: any) => void)[];
    usedBy: Set<string>;
    constructor(gimloader: Gimloader, script: string, headers?: Record<string, any>);
    enable(initial?: boolean): Promise<boolean>;
    addUsed(pluginName: string): void;
    removeUsed(pluginName: string): void;
    disable(): void;
}
