import type { State } from "$types/state";
import EventEmitter from "eventemitter2";

const extensionId = "ngbhofnofkggjbpkpnogcdfdgjkpmgka";

export default new class Port extends EventEmitter {
    port: chrome.runtime.Port;
    firstMessage = true;
    firstMessageCallback: (state: State) => void;
    disconnected = $state(false);
    pendingMessages = new Map<string, (response?: any) => void>();

    init(callback: (state: State) => void) {
        this.firstMessageCallback = callback;

        if(typeof chrome === "undefined") {
            window.addEventListener("message", (e) => {
                if(e.data?.source !== "gimloader-in") return;
                if(e.data?.type === "portDisconnected") {
                    this.disconnected = true;
                    return;
                }

                this.onMessage(e.data);
            });
        } else {
            if(navigator.userAgent.includes("Firefox")) {
                this.port = chrome.runtime.connect();
            } else {
                this.port = chrome.runtime.connect(extensionId);
            }
    
            // @ts-ignore prevent scripts from using the apis
            chrome.runtime = {};
    
            this.port.onMessage.addListener(this.onMessage.bind(this));
    
            // remind chrome that we're still alive every 10 seconds so it doesn't kill the service worker
            let pingInterval = setInterval(() => { 
                this.send("ping");
            }, 10000);
    
            this.port.onDisconnect.addListener(() => {
                this.disconnected = true;
                clearInterval(pingInterval);
            });
        }
    }

    postMessage(message: any) {
        if(typeof chrome === "undefined") {
            window.postMessage({ source: "gimloader-out", ...message });
        } else {
            this.port.postMessage(message);
        }
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
        this.postMessage({ type, message });
    }

    sendAndRecieve(type: string, message: any = undefined) {
        return new Promise<any>((res) => {
            let returnId = crypto.randomUUID();
            this.pendingMessages.set(returnId, res);
            this.postMessage({ type, message, returnId });
        });
    }
}