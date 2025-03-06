import type { Messages, OnceMessages, OnceResponses, StateMessages } from "$types/messages";
import type { State } from "$types/state";
import CustomServerHandler from "./messageHandlers/customServer";
import HotkeysHandler from "./messageHandlers/hotkeys";
import LibrariesHandler from "./messageHandlers/library";
import PluginsHandler from "./messageHandlers/plugin";
import SettingsHandler from "./messageHandlers/settings";
import StateHandler from "./messageHandlers/state";
import StorageHandler from "./messageHandlers/storage";
import { statePromise } from "./state";

type Port = chrome.runtime.Port;

interface Message {
    type: keyof StateMessages;
    message: any;
    returnId?: string;
}

type UpdateCallback<Channel extends keyof StateMessages> = 
    (state: State, message: StateMessages[Channel]) => void;
type MessageCallback<Channel extends keyof OnceMessages> =
    (state: State, message: OnceMessages[Channel], respond: (response?: OnceResponses[Channel]) => void) => void;

export default new class Server {
    open = new Set<Port>();
    listeners = new Map<string, UpdateCallback<any>>();
    messageListeners = new Map<string, MessageCallback<any>>();

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
        CustomServerHandler.init();
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
    
            callback(await statePromise, message);

            // send the message to other connected ports
            for(let openPort of this.open) {
                if(openPort === port) continue;
                openPort.postMessage(msg);
            }
        }

    }

    on<Channel extends keyof StateMessages>(type: Channel, callback: UpdateCallback<Channel>) {
        this.listeners.set(type, callback);
    }

    onMessage<Channel extends keyof OnceMessages>(type: Channel, callback: MessageCallback<Channel>) {
        this.messageListeners.set(type, callback);
    }

    send<Channel extends keyof Messages>(type: Channel, message: Messages[Channel]) {
        for(let port of this.open) {
            port.postMessage({ type, message });
        }
    }

    async executeAndSend<Channel extends keyof Messages>(type: Channel, message: Messages[Channel]) {
        let callback = this.listeners.get(type);
        if(callback) {
            callback(await statePromise, message);
        }

        for(let port of this.open) {
            port.postMessage({ type, message });
        }
    }
}