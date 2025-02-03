import { parsePluginHeader } from "$shared/parseHeader";
import Port from "$shared/port.svelte";
import { plugins, settings } from "./state";

(window as any).GLInstall = function (script: string) {
    return new Promise<void>(async (res, rej) => {
        if(Port.disconnected) {
            return rej("This page has lost connection with the Gimloader extension. Please reload and try again.");
        }

        let headers = parsePluginHeader(script);
        let existing = plugins.find(p => p.name === headers.name);
    
        // try to download libraries (ignore errors)
        if(settings.autoDownloadMissingLibs) {
            await Port.sendAndRecieve("downloadLibraries", { libraries: headers.needsLib });
        }
    
        if(existing) {
            existing.script = script;
            Port.send("pluginEdit", { name: existing.name, script });
        } else {
            plugins.push({ name: headers.name, script, enabled: true });
            Port.send("pluginCreate", { name: headers.name, script });
        }

        res();
    });
};

(window as any).GLGet = function (name: string) {
    return plugins.find(p => p.name === name)?.script;
}