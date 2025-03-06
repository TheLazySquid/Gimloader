import Server from "$bg/server";
import { sanitizeCustomServer, sanitizeHotkeys, sanitizeLibraries, sanitizePlugins,
    sanitizePluginStorage, sanitizeSettings, saveDebounced } from "$bg/state";
import Updater from "$bg/updater";
import type { OnceMessages, OnceResponses } from "$types/messages";
import type { State } from "$types/state";

export default class StateHandler {
    static init() {
        Server.onMessage("getState", this.onGetState.bind(this));
        Server.onMessage("setState", this.onSetState.bind(this));
    }

    static onGetState(state: State, _: OnceMessages["getState"], respond: (response: OnceResponses["getState"]) => void) {
        respond(state);
    }

    static onSetState(state: State, newState: OnceMessages["setState"], respond: () => void) {
        let { plugins, libraries, pluginStorage, settings, hotkeys, customServer } = newState;

        if(plugins) state.plugins = sanitizePlugins(plugins);
        if(libraries) state.libraries = sanitizeLibraries(libraries);
        if(pluginStorage) state.pluginStorage = sanitizePluginStorage(pluginStorage);
        if(settings) state.settings = sanitizeSettings(settings);
        if(hotkeys) state.hotkeys = sanitizeHotkeys(hotkeys);
        if(customServer) state.customServer = sanitizeCustomServer(customServer);

        Server.send("setState", state);

        saveDebounced('plugins');
        saveDebounced('pluginStorage');
        saveDebounced('libraries');
        saveDebounced('hotkeys');
        saveDebounced('settings');
        saveDebounced('customServer');

        if(state.settings.autoUpdate) Updater.checkUpdates();
        respond();
    }
}