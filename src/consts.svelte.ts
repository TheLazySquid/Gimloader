import { version as gimloaderVersion } from "../package.json";
import Storage from "$core/storage";

export const version = gimloaderVersion;
export const settings = $state({
    autoUpdate: Storage.getValue('autoUpdate', false),
    autoDownloadMissingLibs: Storage.getValue('autoDownloadMissingLibs', true),
    menuView: Storage.getValue('menuView', 'grid'),
    showPluginButtons: Storage.getValue('showPluginButtons', true)
});