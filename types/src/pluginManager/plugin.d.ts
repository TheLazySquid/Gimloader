import type { Gimloader } from "$src/gimloader";
export default class Plugin {
    gimloader: Gimloader;
    script: string;
    enabled: boolean;
    headers: Record<string, any>;
    return: any;
    constructor(gimloader: Gimloader, script: string, enabled?: boolean);
    enable(initial?: boolean): Promise<void>;
    disable(): void;
    edit(script: string, headers: Record<string, string>): void;
}
