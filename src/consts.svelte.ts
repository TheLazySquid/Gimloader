import { version as gimloaderVersion } from "../package.json";
import Storage from "$core/storage";

export const version = gimloaderVersion;
export const settings = $state({
    autoUpdatePlugins: Storage.getValue('autoUpdatePlugins', true),
    autoDownloadMissingLibs: Storage.getValue('autoDownloadMissingLibs', true),
    menuView: Storage.getValue('menuView', 'grid'),
    showPluginButtons: Storage.getValue('showPluginButtons', true)
});