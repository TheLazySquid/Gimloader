import { settings } from "$src/consts.svelte";
import UpdateNotif from "$src/ui/UpdateNotif.svelte";
import { mount, unmount } from "svelte";
import Storage from "./storage";
import PluginManager from "./pluginManager/pluginManager.svelte";
import LibManager from "./libManager/libManager.svelte";
import { parsePluginHeader } from "$src/parseHeader";
import { compareVersions } from "./net/checkUpdates";
import { log } from "$src/utils";

export default class UpdateChecker {
    static lastChecked: number = Storage.getValue("lastCheckedPlugins", 0);
    static pluginScripts: Record<string, string> = {};
    static libraryScripts: Record<string, string> = {};

    static async init() {
        if(!settings.autoUpdatePlugins) return;
        let diff = Date.now() - this.lastChecked;
        if(diff < 60 * 60 * 1000) return;

        log("Checking for updates...");

        let shouldUpdate = await this.checkAll();
        log(shouldUpdate, "updates found");
        if(shouldUpdate == 0) return;
        
        let component = mount(UpdateNotif, {
            target: document.body,
            props: {
                onSelected: (confirm) => {
                    this.updateLastChecked();
                    unmount(component);
                    if(confirm) this.applyAll();
                },
                amount: shouldUpdate
            }
        });
    }

    static async checkAll() {
        let promises: Promise<void>[] = [];
        let shouldUpdate = 0;

        for(let plugin of PluginManager.plugins) {
            if(!plugin.headers.downloadUrl) continue;

            promises.push(new Promise(async (res, rej) => {
                try {
                    let resp = await GL.net.corsRequest({ url: plugin.headers.downloadUrl });
                    let headers = parsePluginHeader(resp.responseText);
    
                    if(compareVersions(plugin.headers.version, headers.version) === 'older') {
                        this.pluginScripts[plugin.headers.name] = resp.responseText;
                        shouldUpdate++;
                    }

                    res();
                } catch {
                    rej(`Failed to update ${plugin.headers.name} from ${plugin.headers.downloadUrl}`);
                }
            }));
        }

        for(let library of LibManager.libs) {
            if(!library.headers.downloadUrl) continue;
            promises.push(new Promise(async (res, rej) => {
                try {
                    let resp = await GL.net.corsRequest({ url: library.headers.downloadUrl });
                    let headers = parsePluginHeader(resp.responseText);

                    if(compareVersions(library.headers.version, headers.version) === 'older') {
                        this.libraryScripts[library.headers.name] = resp.responseText;
                        shouldUpdate++;
                    }
                    res();
                } catch {
                    rej(`Failed to update ${library.headers.name} from ${library.headers.downloadUrl}`);
                }
            }));
        }

        await Promise.allSettled(promises);
        
        return shouldUpdate;
    }

    static async applyAll() {
        for(let name in this.libraryScripts) {
            let lib = LibManager.getLib(name);
            if(!lib) continue;

            LibManager.editLib(lib, this.libraryScripts[name]);
        }

        for(let name in this.pluginScripts) {
            let plugin = PluginManager.getPlugin(name);
            if(!plugin) continue;
            
            plugin.edit(this.pluginScripts[name]);
        }

        this.pluginScripts = {};
        this.libraryScripts = {};
    }

    static updateLastChecked() {
        this.lastChecked = Date.now();
        Storage.setValue("lastCheckedPlugins", this.lastChecked);
    }
}