export declare function log(...args: any[]): void;
export declare const onGimkit: boolean;
export declare function parsePluginHeader(code: string): Record<string, any>;
export declare function parseLibHeader(code: string): Record<string, any>;
export default function parseHeader(code: string, headers: Record<string, any>): Record<string, any>;
