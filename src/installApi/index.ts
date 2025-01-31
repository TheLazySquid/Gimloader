import { parsePluginHeader } from "$shared/parseHeader";
import Port from "$shared/port.svelte";
import { plugins } from "./pluginsState";

(window as any).GLInstall = function (script: string) {
    let headers = parsePluginHeader(script);
    let existing = plugins.find(p => p.name === headers.name);

    if(existing) {
        existing.script = script;
        Port.send("pluginEdit", { name: existing.name, script });
    } else {
        plugins.push({ name: headers.name, script, enabled: true });
        Port.send("pluginCreate", { name: headers.name, script });
    }
};

(window as any).GLGet = function (name: string) {
    return plugins.find(p => p.name === name)?.script;
}