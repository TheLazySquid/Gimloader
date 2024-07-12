import type { InputPluginOption } from 'rollup';

export interface OptionalConfig {
    version: string;
    reloadRequired: boolean | "ingame";
    downloadUrl: string;
    libs: string[];
    optionalLibs: string[];
    isLibrary: boolean;
    plugins: InputPluginOption[];
    rollupOptions: any;
    outputOptions: any;
}

export type Config = {
    input: string;
    name: string;
    description: string;
    author: string;
} & Partial<OptionalConfig>;

export interface GLConfig {
    default: Config;
}