import type { HotkeyTrigger } from "./hotkeys";

export interface PluginInfo {
    script: string;
    name: string;
    enabled: boolean;
}

export interface LibraryInfo {
    script: string;
    name: string;
}

export type ScriptInfo = PluginInfo | LibraryInfo;

export type PluginStorage = Record<string, Record<string, any>>

export type ConfigurableHotkeysState = Record<string, HotkeyTrigger | null>;

export interface Settings {
    pollerEnabled: boolean;
    autoUpdate: boolean;
    autoDownloadMissingLibs: boolean;
    menuView: 'grid' | 'list';
    showPluginButtons: boolean;
}

export interface CustomServerConfig {
    enabled: boolean;
    address: string;
    type: "all" | "game";
    port: number;
}

export interface SavedState {
    plugins: PluginInfo[];
    libraries: LibraryInfo[];
    pluginStorage: PluginStorage;
    settings: Settings;
    hotkeys: ConfigurableHotkeysState;
    customServer: CustomServerConfig;
}

export interface State extends SavedState {
    availableUpdates: string[];
}