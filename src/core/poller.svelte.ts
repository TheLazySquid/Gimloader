import { parseLibHeader, parsePluginHeader } from "$src/parseHeader";
import Net from "$core/net/net";
import LibManager from "$core/libManager/libManager.svelte";
import PluginManager from "$core/pluginManager/pluginManager.svelte";
import GimkitInternals from "$core/internals";
import Storage from "$core/storage";

class Poller {
    enabled: boolean = $state(Storage.getValue("pollerEnabled", false));
    uid = Math.random().toString(36).substring(2);

    init() {
        if(this.enabled) this.sendRequest();
    }

    setEnabled(enabled: boolean) {
        console.log("Poller:", enabled);
        this.enabled = enabled;
        Storage.setValue("pollerEnabled", enabled);

        if(enabled) this.sendRequest();
    }

    sendRequest() {
        if(!this.enabled) return;
        Net.corsRequest({ url: "http://localhost:5822/getUpdate", headers: { "uid": this.uid } })
            .catch(() => {
                // retry in 5 seconds
                setTimeout(() => {
                    this.sendRequest();
                }, 5000);
            })
            .then((res) => {
                if(!this.enabled) return;
                if(!res || res.status !== 200) return;

                // determine whether the code is for a library
                let isLibrary = false;
                let headers = res.responseHeaders.replaceAll('\r\n', '\n').split('\n');
                for(let header of headers) {
                    let [key, value] = header.split(': ');
                    if(key === 'is-library') {
                        isLibrary = value === 'true';
                        break;
                    }
                }

                this.sendRequest();

                // create/edit the library/plugin
                if(isLibrary) {
                    let headers = parseLibHeader(res.responseText);
                    let existing = LibManager.getLib(headers.name);
                    if(existing?.script === res.responseText) return;

                    LibManager.createLib(res.responseText, headers, true);
                    GimkitInternals.notification?.open({ message: `Hot reloaded library ${headers.name}` })
                } else {
                    let headers = parsePluginHeader(res.responseText);
                    
                    let plugin = PluginManager.getPlugin(headers.name);
                    if(plugin?.script === res.responseText) return;

                    if(plugin) {
                        plugin.edit(res.responseText, headers);
                    } else {
                        PluginManager.createPlugin(res.responseText);
                    }

                    GimkitInternals.notification?.open({ message: `Hot reloaded plugin ${headers.name}` })
                }
            })
    }
}

const poller = new Poller;
export default poller;