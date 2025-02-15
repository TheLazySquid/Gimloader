import { parseLibHeader, parsePluginHeader } from "$shared/parseHeader";
import type { ScriptHeaders } from "$types/headers";
import type { State } from "$types/state";
import Server from "./server";
import { saveDebounced, statePromise } from "./state";

interface IUpdate {
    type: "plugin" | "library";
    name: string;
    newName: string;
    script: string;
}

export default class Updater {
    static updates: IUpdate[] = [];

    static async init() {
        Server.onMessage("applyUpdates", this.applyUpdates.bind(this));
        
        let state = await statePromise;
        if(!state.settings.autoUpdate) return;

        let stored = await chrome.storage.local.get({
            lastUpdateCheck: 0
        });

        let diff = Date.now() - stored.lastUpdateCheck;

        // check for updates once every hour
        if(diff < 60 * 60 * 1000) return;

        this.checkUpdates();
    }

    static async checkUpdates() {
        let state = await statePromise;
        let updaters: (() => Promise<void>)[] = [];

        const checkUpdate = (headers: ScriptHeaders, type: "plugin" | "library") => {
            return () => {
                return new Promise<void>(async (res, rej) => {
                    let text = await this.getText(headers.downloadUrl)
                    if(!text) return rej();
    
                    let newHeaders = parsePluginHeader(text);
                    if(!this.shouldUpdate(headers, newHeaders)) return res();
    
                    this.updates.push({
                        type,
                        name: headers.name,
                        newName: newHeaders.name,
                        script: text
                    });

                    res();
                });
            }
        }

        for(let plugin of state.plugins) {
            let headers = parsePluginHeader(plugin.script);
            if(!headers.downloadUrl) continue;
            updaters.push(checkUpdate(headers, "plugin"));
        }

        for(let lib of state.libraries) {
            let headers = parseLibHeader(lib.script);
            if(!headers.downloadUrl) continue;
            updaters.push(checkUpdate(headers, "library"));
        }

        let finished = false;
        
        const advance = () => {
            let update = updaters.shift();
            if(!update) {
                if(finished) return;
                finished = true;

                state.availableUpdates = this.updates.map(s => s.name);
                Server.send("availableUpdates", state.availableUpdates);
        
                chrome.storage.local.set({ lastUpdateCheck: Date.now() });
                return;
            }

            update().finally(advance);
        }

        let maxConcurrent = 5;
        for(let i = 0; i < Math.min(maxConcurrent, updaters.length); i++) {
            advance();
        }
    }

    static shouldUpdate(oldHeaders: ScriptHeaders, newHeaders: ScriptHeaders) {
        if(!oldHeaders.version) return true;
        if(!newHeaders.version) return false;

        let oldParts = oldHeaders.version.split(".").map((n) => parseInt(n));
        let newParts = newHeaders.version.split(".").map((n) => parseInt(n));

        for(let i = 0; i < newParts.length; i++) {
            let oldPart = oldParts[i]
            let newPart = newParts[i];

            if(newPart > oldPart) return true;
            if(newPart < oldPart) return false;
        }

        return false;
    }

    static getText(url: string) {
        return new Promise<string | null>((res) => {
            fetch(url)
                .catch(() => res(null))
                .then((resp) => {
                    if(!resp) return res(null);
                    if(resp.status !== 200) return res(null);
                    resp.text().then(res, () => res(null));
                })
        });
    }

    static applyUpdates(state: State, message: any, respond: () => void) {
        if(message.apply) {
            for(let update of this.updates) {
                let { type, ...message } = update;
    
                if(type === "plugin") {
                    let plugin = state.plugins.find(p => p.name === update.name);
                    if(!plugin) continue;
                    plugin.name = update.newName;
                    plugin.script = update.script;
    
                    saveDebounced("plugins");
                    Server.send("pluginEdit", message);
                } else {
                    let plugin = state.libraries.find(p => p.name === update.name);
                    if(!plugin) continue;
                    plugin.name = update.newName;
                    plugin.script = update.script;
    
                    saveDebounced("libraries");
                    Server.send("libraryEdit", message);
                }
            }
        }

        this.updates = [];
        state.availableUpdates = [];
        Server.send("availableUpdates", []);

        respond();
    }
}