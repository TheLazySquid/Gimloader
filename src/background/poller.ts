import SettingsHandler from './messageHandlers/settings';
import { saveDebounced, statePromise } from './state';
import { parseLibHeader, parsePluginHeader } from '$shared/parseHeader';
import Server from './server';
import { isFirefox } from '$shared/env';

export default class Poller {
    static enabled = false;
    static uid = Math.random().toString(36).substring(2);

    static init(enabled: boolean) {
        this.setEnabled(enabled);

        SettingsHandler.on("pollerEnabled", (enabled) => {
            this.setEnabled(enabled);
        });
    }

    static setEnabled(enabled: boolean) {
        this.enabled = enabled;

        if(enabled) this.sendRequest();
    }

    static async sendRequest() {
        if(isFirefox) return;
        if(!this.enabled) return;

        const tryAgain = () => {
            setTimeout(() => this.sendRequest(), 5000);
        }

        let res = await fetch("http://localhost:5822/getUpdate", { headers: { uid: this.uid }})
            .catch(tryAgain);
        if(!res) return;
        
        if(res.status !== 200) return tryAgain();
        let text = await res.text();
        let state = await statePromise;
        if(!this.enabled) return;

        this.sendRequest();

        if(res.headers.get('is-library') === 'true') {
            let headers = parseLibHeader(text);
            let lib = state.libraries.find(l => l.name === headers.name);
            if(lib) {
                lib.script = text;
                Server.send("libraryEdit", { name: lib.name, newName: lib.name, script: text });
            } else {
                let obj = { script: text, name: headers.name };
                state.libraries.push(obj);
                Server.send("libraryCreate", obj);
            }
            
            Server.send("toast", { type: "success", message: `Hot reloaded library ${headers.name}`});
            saveDebounced('libraries');
        } else {
            let headers = parsePluginHeader(text);
            let plugin = state.plugins.find(p => p.name === headers.name);
            if(plugin) {
                plugin.script = text;
                Server.send("pluginEdit", { name: plugin.name, newName: plugin.name, script: text });
            } else {
                let obj = { script: text, name: headers.name, enabled: true };
                state.plugins.push(obj);
                Server.send("pluginCreate", obj);
            }
            
            Server.send("toast", { type: "success", message: `Hot reloaded plugin ${headers.name}`});
            saveDebounced('plugins');
        }
    }
}