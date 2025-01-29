import { statePromise } from "./state";
import { storageOnUpdate } from "./messageHandlers/storage";
import { libraryOnUpdate } from "./messageHandlers/library";
import { hotkeysOnUpdate } from "./messageHandlers/hotkeys";
import { pluginOnUpdate } from "./messageHandlers/plugin";

let openPorts = new Set<chrome.runtime.Port>();

chrome.runtime.onConnectExternal.addListener(async (port) => {
    openPorts.add(port);
    port.onDisconnect.addListener(() => openPorts.delete(port));

    port.onMessage.addListener(async (data) => {
        if(!data?.type) return;
        let { type, message } = data;
        let state = await statePromise;

        // if any of the handlers return a match, forward to other tabs
        if(
            storageOnUpdate(state, type, message) ||
            libraryOnUpdate(state, type, message) ||
            hotkeysOnUpdate(state, type, message) ||
            pluginOnUpdate(state, type, message)
        ) {
            for(let openPort of openPorts) {
                if(openPort != port) {
                    openPort.postMessage(data);
                }
            }
        };
    });

    let state = await statePromise;

    port.postMessage(state);
});