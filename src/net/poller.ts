import { parseLibHeader, parsePluginHeader } from "$src/util";

export default class Poller {
    enabled: boolean = GM_getValue("pollerEnabled", false);
    uid = Math.random().toString(36).substring(2);

    constructor() {
        if(this.enabled) this.sendRequest();
    }

    setEnabled(enabled: boolean) {
        this.enabled = enabled;
        GM_setValue("pollerEnabled", enabled);

        if(enabled) this.sendRequest();
    }

    sendRequest() {
        if(!this.enabled) return;
        GM.xmlHttpRequest({ url: "http://localhost:5822/getUpdate", headers: { "uid": this.uid } })
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
                    let existing = GL.libManager.getLib(headers.name);
                    if(existing?.script === res.responseText) return;

                    GL.libManager.createLib(res.responseText, headers, true);
                    GL.notification?.open({ message: `Hot reloaded library ${headers.name}` })
                } else {
                    let headers = parsePluginHeader(res.responseText);
                    
                    let plugin = GL.pluginManager.getPlugin(headers.name);
                    if(plugin?.script === res.responseText) return;

                    if(plugin) {
                        plugin.edit(res.responseText, headers);
                    } else {
                        GL.pluginManager.createPlugin(res.responseText);
                    }

                    GL.notification?.open({ message: `Hot reloaded plugin ${headers.name}` })
                }
            })
    }
}