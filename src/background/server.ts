import type { State } from "$types/state";
import HotkeysHandler from "./messageHandlers/hotkeys";
import LibrariesHandler from "./messageHandlers/library";
import PluginsHandler from "./messageHandlers/plugin";
import SettingsHandler from "./messageHandlers/settings";
import StateHandler from "./messageHandlers/state";
import StorageHandler from "./messageHandlers/storage";
import { statePromise } from "./state";

type Port = chrome.runtime.Port;

interface Message {
    type: string;
    message: any;
    returnId?: string;
}

type UpdateCallback = (state: State, message: any) => boolean | void;
type MessageCallback = (state: State, message: any, respond: (response?: any) => void) => void;

export default new class Server {
    open = new Set<Port>();
    listeners = new Map<string, UpdateCallback>();
    messageListeners = new Map<string, MessageCallback>();

    init() {
        chrome.runtime.onConnectExternal.addListener(this.onConnect.bind(this));
        chrome.runtime.onConnect.addListener(this.onConnect.bind(this));

        // these are only used to keep the worker alive
        chrome.runtime.onMessageExternal.addListener(() => {});
        chrome.runtime.onMessage.addListener(() => {});

        HotkeysHandler.init();
        LibrariesHandler.init();
        PluginsHandler.init();
        StorageHandler.init();
        SettingsHandler.init();
        StateHandler.init();
    }

    onConnect(port: Port) {
        this.open.add(port);
        port.onDisconnect.addListener(() => this.open.delete(port));

        statePromise.then((state) => port.postMessage(state));

        port.onMessage.addListener((message) => {
            this.onPortMessage(port, message);
        });
    }

    async onPortMessage(port: Port, msg: Message) {
        let { type, message, returnId } = msg;

        // pings are just to keep the service worker alive
        if(type === "ping") return;

        if(returnId) {
            // message with a response (not done with .sendMessage to avoid race conditions)
            let callback = this.messageListeners.get(type);
            if(!callback) return;
    
            callback(await statePromise, message, (response?: void) => {
                port.postMessage({ returnId, response });
            });
        } else {
            // no reply expected, just a state update
            let callback = this.listeners.get(type);
            if(!callback) return;
    
            let noForward = callback(await statePromise, message);
            if(noForward) return;

            // send the message to other connected ports
            for(let openPort of this.open) {
                if(openPort === port) continue;
                openPort.postMessage(msg);
            }
        }

    }

    on(type: string, callback: UpdateCallback) {
        this.listeners.set(type, callback);
    }

    onMessage(type: string, callback: MessageCallback) {
        this.messageListeners.set(type, callback);
    }

    send(type: string, message: any) {
        for(let port of this.open) {
            port.postMessage({ type, message });
        }
    }
}