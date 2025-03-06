import type { CustomServerConfig, Settings } from "$types/state";

export const isFirefox = navigator.userAgent.includes("Firefox");

export const algorithm: HmacKeyGenParams = {
    name: "HMAC",
    hash: { name: "SHA-512" }
};

export const defaultSettings: Settings = {
    pollerEnabled: false,
    autoUpdate: true,
    autoDownloadMissingLibs: true,
    menuView: 'grid',
    showPluginButtons: true
}

export const defaultCustomServer: CustomServerConfig = {
    enabled: false,
    address: "localhost",
    type: "game",
    port: 5823
}