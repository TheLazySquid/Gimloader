import type { State } from "$types/state";
import EventEmitter from "eventemitter2";

const extensionId = "ngbhofnofkggjbpkpnogcdfdgjkpmgka";

class Port extends EventEmitter {
    port: chrome.runtime.Port;
    firstMessage = true;
    firstMessageCallback: (state: State) => void;

    init(callback: (state: State) => void) {      
        this.firstMessageCallback = callback;
        this.port = chrome.runtime.connect(extensionId);  
        this.port.onMessage.addListener(this.onMessage.bind(this));
    }

    onMessage(data: any) {
        // the first message will contain the state, others will contain updates to it
        if(this.firstMessage) {
            this.firstMessageCallback(data);
            this.firstMessage = false;
            return;
        }

        this.emit(data.type, data.message);
    }

    send(type: string, message: any = undefined) {
        this.port.postMessage({ type, message });
    }
}

const port = new Port();
export default port;