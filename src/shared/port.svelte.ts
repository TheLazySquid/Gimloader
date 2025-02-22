import type { State } from "$types/state";
import EventEmitter from "eventemitter2";
import { isFirefox } from "./env";

const extensionId = "ngbhofnofkggjbpkpnogcdfdgjkpmgka";
type StateCallback = (state: State) => void;

export default new class Port extends EventEmitter {
    port: chrome.runtime.Port;
    firstMessage = true;
    firstState = true;
    firstCallback: StateCallback;
    subsequentCallback: StateCallback;
    disconnected = $state(false);
    pendingMessages = new Map<string, (response?: any) => void>();
    runtime: typeof chrome.runtime;

    init(callback: StateCallback, subsequentCallback: StateCallback) {
        this.firstCallback = callback;
        this.subsequentCallback = subsequentCallback;

        if(typeof chrome === "undefined") {
            window.addEventListener("message", (e) => {
                if(e.data?.source !== "gimloader-in") return;
                if(e.data?.type === "portDisconnected") {
                    this.firstMessage = true;
                    this.disconnected = true;
                    return;
                }

                this.onMessage(e.data);
            });

            window.postMessage({ source: "gimloader-out", type: "ready" });
        } else {
            if(isFirefox) {
                this.port = chrome.runtime.connect();
            } else {
                this.port = chrome.runtime.connect(extensionId);
            }
    
            this.runtime = chrome.runtime;
            // @ts-ignore prevent scripts from using the apis
            chrome.runtime = {};
    
            this.connectPort();
        }
    }

    connectPort() {
        this.firstMessage = true;

        if(isFirefox) {
            this.port = this.runtime.connect();
        } else {
            this.port = this.runtime.connect(extensionId);
        }
        
        this.port.onMessage.addListener(this.onMessage.bind(this));

        let pingInterval = setInterval(() => { 
            this.send("ping");
        }, 10000);

        this.port.onDisconnect.addListener(() => {
            console.log("Port disconnected, reconnecting...");
            this.disconnected = true;
            clearInterval(pingInterval);

            if(this.runtime.lastError) {
                // extension is likely removed entirely (if reinstalled we can reconnect)
                setTimeout(() => this.connectPort(), 10000);
            } else {
                this.connectPort();
            }
        });
    }

    postMessage(message: any) {
        // just discard messages sent while disconnected, we'll resynchronize to before they mattered
        if(this.disconnected) return;

        if(typeof chrome === "undefined") {
            window.postMessage({ source: "gimloader-out", ...message });
        } else {
            this.port.postMessage(message);
        }
    }

    onMessage(data: any) {
        this.disconnected = false;

        // the first message will contain the state, others will contain updates to it
        if(this.firstMessage) {
            if(this.firstState) {
                this.firstState = false;
                this.firstCallback(data);
            } else {
                this.subsequentCallback(data);
            }
            
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
        // strip non-serializable things or firefox complains
        if(message) message = JSON.parse(JSON.stringify(message));

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