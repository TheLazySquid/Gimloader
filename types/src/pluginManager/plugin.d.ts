export default class Plugin {
    script: string;
    enabled: boolean;
    headers: Record<string, any>;
    return: any;
    runPlugin: boolean;
    constructor(script: string, enabled?: boolean, initial?: boolean, runPlugin?: boolean);
    enable(initial?: boolean): Promise<void>;
    disable(): void;
    edit(script: string, headers: Record<string, string>): void;
}
