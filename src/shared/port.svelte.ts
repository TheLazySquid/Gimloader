import type { State } from "$types/state";
import EventEmitter from "eventemitter2";

const extensionId = "ngbhofnofkggjbpkpnogcdfdgjkpmgka";

class Port extends EventEmitter {
    port: chrome.runtime.Port;
    firstMessage = true;
    firstMessageCallback: (state: State) => void;
    disconnected = $state(false);
    pendingMessages = new Map<string, (response?: any) => void>();

    init(callback: (state: State) => void) {      
        this.firstMessageCallback = callback;
        this.port = chrome.runtime.connect(extensionId);  

        // @ts-ignore prevent scripts from using the apis
        chrome.runtime = {};

        this.port.onMessage.addListener(this.onMessage.bind(this));
        this.port.onDisconnect.addListener(() => {
            this.disconnected = true;
        });

        // remind chrome that we're still alive every 10 seconds so it doesn't kill the service worker
        setInterval(() => {
            this.send("ping");
        }, 10000);
    }

    onMessage(data: any) {
        // the first message will contain the state, others will contain updates to it
        if(this.firstMessage) {
            this.firstMessageCallback(data);
            this.firstMessage = false;
            return;
        }

        if(data.returnId) {
            let { response, returnId } = data;
            let callback = this.pendingMessages.get(returnId);
            if(!callback) return;

            callback(response);
            this.pendingMessages.delete(returnId);
        } else {
            this.emit(data.type, data.message);
        }
    }

    send(type: string, message: any = undefined) {
        this.port.postMessage({ type, message });
    }

    sendAndRecieve(type: string, message: any = undefined) {
        return new Promise<any>((res) => {
            let returnId = crypto.randomUUID();
            this.pendingMessages.set(returnId, res);
            this.port.postMessage({ type, message, returnId });
        });
    }
}

const port = new Port();
export default port;