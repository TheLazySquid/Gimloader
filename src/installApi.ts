import { parseHeader } from "./loadPlugins";
import { getUnsafeWindow, getValue, setValue } from "./util";

interface IPluginInfo {
    script: string;
    enabled: boolean;
}

export default function initInstallApi() {
    let pluginInfos: IPluginInfo[] = JSON.parse(getValue('plugins', '[]')!);
    let pluginHeaders = pluginInfos.map((plugin) => parseHeader(plugin.script));

    (getUnsafeWindow() as any).GLInstall = function (script: string) {
        let scriptHeaders = parseHeader(script);

        for(let i = 0; i < pluginHeaders.length; i++) {
            let headers = pluginHeaders[i];

            // confirmation is done on the site
            if(headers.name === scriptHeaders.name) {
                pluginInfos.splice(i, 1);
                pluginHeaders.splice(i, 1);
                i--;
            }
        }

        pluginInfos.push({ script, enabled: true });
        setValue('plugins', JSON.stringify(pluginInfos));
    };

    (getUnsafeWindow() as any).GLGet = function (name: string) {
        let index = pluginHeaders.findIndex((header) => header.name === name);
        if(index === -1) return null;

        return pluginInfos[index].script;
    }
}