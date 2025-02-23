export interface PluginHeaders {
    name: string;
    description: string;
    author: string;
    version: string | null;
    reloadRequired: string;
    isLibrary: string;
    downloadUrl: string | null;
    needsLib: string[];
    optionalLib: string[];
    hasSettings: string;
    webpage: string | null;
}

export interface LibHeaders {
    name: string;
    description: string;
    author: string;
    version: string | null;
    reloadRequired: string;
    isLibrary: string;
    downloadUrl: string | null;
    webpage: string | null;
}

export type ScriptHeaders = PluginHeaders | LibHeaders;