import type { State } from "$types/state";
import HotkeysHandler from "./messageHandlers/hotkeys";
import LibrariesHandler from "./messageHandlers/library";
import PluginsHandler from "./messageHandlers/plugin";
import SettingsHandler from "./messageHandlers/settings";
import StorageHandler from "./messageHandlers/storage";
import { state } from "./state";

type Port = chrome.runtime.Port;

interface Message {
    type: string;
    message: any;
    returnId?: string;
}

type UpdateCallback = (state: State, message: any) => void;
type MessageCallback = (state: State, message: any, respond: (response?: any) => void) => void;

class Server {
    open = new Set<Port>();
    listeners = new Map<string, UpdateCallback>();
    messageListeners = new Map<string, MessageCallback>();

    init() {
        chrome.runtime.onConnectExternal.addListener(this.onConnect.bind(this));
        chrome.runtime.onConnect.addListener(this.onConnect.bind(this));

        HotkeysHandler.init();
        LibrariesHandler.init();
        PluginsHandler.init();
        StorageHandler.init();
        SettingsHandler.init();
    }

    onConnect(port: Port) {
        this.open.add(port);
        port.onDisconnect.addListener(() => this.open.delete(port));

        state.then((state) => port.postMessage(state));

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
    
            callback(await state, message, (response?: void) => {
                port.postMessage({ returnId, response });
            });
        } else {
            // no reply expected, just a state update
            let callback = this.listeners.get(type);
            if(!callback) return;
    
            callback(await state, message);
    
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

const server = new Server();
export default server;