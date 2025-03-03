import { parseLibHeader, parsePluginHeader } from "$shared/parseHeader";
import type { ScriptHeaders } from "$types/headers";
import type { OnceMessages, OnceResponses } from "$types/messages";
import type { LibraryInfo, PluginInfo, State } from "$types/state";
import type { Update } from "$types/updater";
import Server from "./server";
import { saveDebounced, statePromise } from "./state";

export default class Updater {
    static updates: Update[] = [];

    static async init() {
        Server.onMessage("applyUpdates", this.applyUpdates.bind(this));
        Server.onMessage("updateAll", this.updateAll.bind(this));
        Server.onMessage("updateSingle", this.updateSingle.bind(this));
        
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

    static async checkUpdates(broadcast = true) {
        return new Promise<void>(async (res) => {
            let state = await statePromise;
            let updaters: (() => Promise<void>)[] = [];
    
            const checkUpdate = (headers: ScriptHeaders, type: "plugin" | "library") => {
                return () => {
                    return new Promise<void>(async (res) => {
                        let text = await this.getText(headers.downloadUrl);
                        if(!text) return res();
                        
                        // it doesn't matter whether we use parse lib or plugin header here
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
    
                    chrome.storage.local.set({ lastUpdateCheck: Date.now() });
                    
                    if(broadcast) {
                        state.availableUpdates = this.updates.map(s => s.name);
                        Server.send("availableUpdates", state.availableUpdates);
                    }
                    res();
                    return;
                }
    
                update().finally(advance);
            }
    
            let maxConcurrent = 5;
            for(let i = 0; i < Math.min(maxConcurrent, updaters.length); i++) {
                advance();
            }
        });
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

        if(newParts.length > oldParts.length) return true;

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
                });
        });
    }

    static async applyUpdate(state: State, update: Update) {
        let { type, ...message } = update;
    
        if(type === "plugin") {
            // if a plugin with the new name exists, just overwrite it
            // not the best solution but this should almost never happen and the consequences are bad if it's not adressed
            let existing = state.plugins.find(p => p.name === update.newName);
            if(existing) {
                await Server.executeAndSend("pluginDelete", { name: update.newName });
            }

            let plugin = state.plugins.find(p => p.name === update.name);
            if(!plugin) return;
            plugin.name = update.newName;
            plugin.script = update.script;

            saveDebounced("plugins");
            Server.send("pluginEdit", message);
        } else {
            let existing = state.libraries.find(p => p.name === update.newName);
            if(existing) {
                await Server.executeAndSend("libraryDelete", { name: update.newName });
            }

            let plugin = state.libraries.find(p => p.name === update.name);
            if(!plugin) return;
            plugin.name = update.newName;
            plugin.script = update.script;

            saveDebounced("libraries");
            Server.send("libraryEdit", message);
        }
    }

    static applyUpdates(state: State, apply: boolean) {
        if(apply) {
            for(let update of this.updates) {
                this.applyUpdate(state, update);
            }
        }

        this.updates = [];
        state.availableUpdates = [];
        Server.send("availableUpdates", []);
    }

    static onApplyUpdates(state: State, message: OnceMessages["applyUpdates"], respond: () => void) {
        this.applyUpdates(state, message.apply);

        respond();
    }

    static async updateAll(state: State, _: OnceMessages["updateAll"], respond: (names: OnceResponses["updateAll"]) => void) {
        await this.checkUpdates(false);
        let names = this.updates.map(u => u.name);

        this.applyUpdates(state, true);
        respond(names);
    }

    static async updateSingle(state: State, message: OnceMessages["updateSingle"], respond: (updated: OnceResponses["updateSingle"]) => void) {
        let script: PluginInfo | LibraryInfo;
        if(message.type === "plugin") script = state.plugins.find(p => p.name === message.name);
        else script = state.libraries.find(l => l.name === message.name);

        let headers = parsePluginHeader(script.script);
        if(!headers.downloadUrl) return respond({ updated: false });

        let text = await this.getText(headers.downloadUrl);
        if(!text) return respond({ updated: false, failed: true });

        let newHeaders = parsePluginHeader(text);
        if(!this.shouldUpdate(headers, newHeaders)) return respond({ updated: false });

        this.applyUpdate(state, {
            type: message.type,
            name: headers.name,
            script: text,
            newName: newHeaders.name
        });

        respond({ updated: true, version: newHeaders.version });
    }
}