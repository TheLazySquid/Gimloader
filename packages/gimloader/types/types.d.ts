declare module "types/headers" {
    export interface PluginHeaders {
        name: string;
        description: string;
        author: string;
        version: string | null;
        reloadRequired: string;
        isLibrary: string;
        downloadUrl: string | null;
        needsLib: string[];
        optionalLib: string[];
        hasSettings: string;
        webpage: string | null;
    }
    export interface LibHeaders {
        name: string;
        description: string;
        author: string;
        version: string | null;
        reloadRequired: string;
        isLibrary: string;
        downloadUrl: string | null;
        webpage: string | null;
    }
    export type ScriptHeaders = PluginHeaders | LibHeaders;
}
declare module "shared/parseHeader" {
    import type { LibHeaders, PluginHeaders } from "types/headers";
    export function parsePluginHeader(code: string): PluginHeaders;
    export function parseLibHeader(code: string): LibHeaders;
    export function parseHeader<T>(code: string, headers: T): T;
}
declare module "content/ui/showErrorMessage" {
    export default function showErrorMessage(msg: string, title?: string): void;
}
declare module "types/hotkeys" {
    /** @inline */
    export interface HotkeyTrigger {
        /** Should be a keyboardevent [code](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code) */
        key?: string;
        /** Should be keyboardevent [codes](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code) */
        keys?: string[];
        ctrl?: boolean;
        shift?: boolean;
        alt?: boolean;
    }
    /** @inline */
    export interface HotkeyOptions extends HotkeyTrigger {
        preventDefault?: boolean;
    }
    /** @inline */
    export interface ConfigurableHotkeyOptions {
        category: string;
        /** There should be no duplicate titles within a category */
        title: string;
        preventDefault?: boolean;
        default?: HotkeyTrigger;
    }
}
declare module "types/state" {
    import type { HotkeyTrigger } from "types/hotkeys";
    export interface PluginInfo {
        script: string;
        name: string;
        enabled: boolean;
    }
    export interface LibraryInfo {
        script: string;
        name: string;
    }
    export type PluginStorage = Record<string, Record<string, any>>;
    export type ConfigurableHotkeysState = Record<string, HotkeyTrigger | null>;
    export interface Settings {
        pollerEnabled: boolean;
        autoUpdate: boolean;
        autoDownloadMissingLibs: boolean;
        menuView: 'grid' | 'list';
        showPluginButtons: boolean;
    }
    export interface SavedState {
        plugins: PluginInfo[];
        libraries: LibraryInfo[];
        pluginStorage: PluginStorage;
        settings: Settings;
        hotkeys: ConfigurableHotkeysState;
    }
    export interface State extends SavedState {
        availableUpdates: string[];
    }
}
declare module "shared/port.svelte" {
    import type { State } from "types/state";
    const _default: {
        port: chrome.runtime.Port;
        firstMessage: boolean;
        firstMessageCallback: (state: State) => void;
        disconnected: boolean;
        pendingMessages: Map<string, (response?: any) => void>;
        init(callback: (state: State) => void): void;
        onMessage(data: any): void;
        send(type: string, message?: any): void;
        sendAndRecieve(type: string, message?: any): Promise<any>;
        emit(event: import("eventemitter2").event | import("eventemitter2").eventNS, ...values: any[]): boolean;
        emitAsync(event: import("eventemitter2").event | import("eventemitter2").eventNS, ...values: any[]): Promise<any[]>;
        addListener(event: import("eventemitter2").event | import("eventemitter2").eventNS, listener: import("eventemitter2").ListenerFn): any | import("eventemitter2").Listener;
        on(event: import("eventemitter2").event | import("eventemitter2").eventNS, listener: import("eventemitter2").ListenerFn, options?: boolean | import("eventemitter2").OnOptions): any | import("eventemitter2").Listener;
        prependListener(event: import("eventemitter2").event | import("eventemitter2").eventNS, listener: import("eventemitter2").ListenerFn, options?: boolean | import("eventemitter2").OnOptions): any | import("eventemitter2").Listener;
        once(event: import("eventemitter2").event | import("eventemitter2").eventNS, listener: import("eventemitter2").ListenerFn, options?: true | import("eventemitter2").OnOptions): any | import("eventemitter2").Listener;
        prependOnceListener(event: import("eventemitter2").event | import("eventemitter2").eventNS, listener: import("eventemitter2").ListenerFn, options?: boolean | import("eventemitter2").OnOptions): any | import("eventemitter2").Listener;
        many(event: import("eventemitter2").event | import("eventemitter2").eventNS, timesToListen: number, listener: import("eventemitter2").ListenerFn, options?: boolean | import("eventemitter2").OnOptions): any | import("eventemitter2").Listener;
        prependMany(event: import("eventemitter2").event | import("eventemitter2").eventNS, timesToListen: number, listener: import("eventemitter2").ListenerFn, options?: boolean | import("eventemitter2").OnOptions): any | import("eventemitter2").Listener;
        onAny(listener: import("eventemitter2").EventAndListener): any;
        prependAny(listener: import("eventemitter2").EventAndListener): any;
        offAny(listener: import("eventemitter2").ListenerFn): any;
        removeListener(event: import("eventemitter2").event | import("eventemitter2").eventNS, listener: import("eventemitter2").ListenerFn): any;
        off(event: import("eventemitter2").event | import("eventemitter2").eventNS, listener: import("eventemitter2").ListenerFn): any;
        removeAllListeners(event?: import("eventemitter2").event | import("eventemitter2").eventNS): any;
        setMaxListeners(n: number): void;
        getMaxListeners(): number;
        eventNames(nsAsArray?: boolean): (import("eventemitter2").event | import("eventemitter2").eventNS)[];
        listenerCount(event?: import("eventemitter2").event | import("eventemitter2").eventNS): number;
        listeners(event?: import("eventemitter2").event | import("eventemitter2").eventNS): import("eventemitter2").ListenerFn[];
        listenersAny(): import("eventemitter2").ListenerFn[];
        waitFor(event: import("eventemitter2").event | import("eventemitter2").eventNS, timeout?: number): import("eventemitter2").CancelablePromise<any[]>;
        waitFor(event: import("eventemitter2").event | import("eventemitter2").eventNS, filter?: import("eventemitter2").WaitForFilter): import("eventemitter2").CancelablePromise<any[]>;
        waitFor(event: import("eventemitter2").event | import("eventemitter2").eventNS, options?: import("eventemitter2").WaitForOptions): import("eventemitter2").CancelablePromise<any[]>;
        listenTo(target: import("eventemitter2").GeneralEventEmitter, events: import("eventemitter2").event | import("eventemitter2").eventNS, options?: import("eventemitter2").ListenToOptions): any;
        listenTo(target: import("eventemitter2").GeneralEventEmitter, events: import("eventemitter2").event[], options?: import("eventemitter2").ListenToOptions): any;
        listenTo(target: import("eventemitter2").GeneralEventEmitter, events: Object, options?: import("eventemitter2").ListenToOptions): any;
        stopListeningTo(target?: import("eventemitter2").GeneralEventEmitter, event?: import("eventemitter2").event | import("eventemitter2").eventNS): Boolean;
        hasListeners(event?: String): Boolean;
    };
    export default _default;
}
declare module "content/core/libManager/libManager.svelte" {
    import Lib from "content/core/libManager/lib.svelte";
    import type { LibraryInfo } from "types/state";
    const _default_1: {
        libs: Lib[];
        init(libInfo: LibraryInfo[]): void;
        get(libName: string): any;
        getLib(libName: string): Lib;
        createLib(script: string, ignoreDuplicates?: boolean, emit?: boolean): Lib;
        deleteLib(lib: Lib, emit?: boolean): void;
        deleteAll(emit?: boolean): void;
        getLibHeaders(name: string): {
            [x: string]: any;
        };
        isEnabled(name: string): boolean;
        getLibNames(): string[];
        editLibrary(library: Lib | string, script: string, emit?: boolean): Promise<void>;
        arrangeLibs(order: string[], emit?: boolean): void;
    };
    export default _default_1;
}
declare module "content/core/pluginManager/plugin.svelte" {
    export default class Plugin {
        script: string;
        enabled: boolean;
        headers: Record<string, any>;
        return: any;
        blobUuid: string | null;
        onStop: (() => void)[];
        openSettingsMenu: (() => void)[];
        enablePromise: Promise<void> | null;
        errored: boolean;
        constructor(script: string, enabled?: boolean);
        launch(initial?: boolean): Promise<void>;
        stop(): void;
    }
}
declare module "content/core/patcher" {
    /** @inline */
    export type PatcherAfterCallback = (thisVal: any, args: IArguments, returnVal: any) => any;
    /** @inline */
    export type PatcherBeforeCallback = (thisVal: any, args: IArguments) => boolean | void;
    /** @inline */
    export type PatcherInsteadCallback = (thisVal: any, args: IArguments) => void;
    type Patch = {
        callback: PatcherBeforeCallback;
        point: 'before';
    } | {
        callback: PatcherAfterCallback;
        point: 'after';
    } | {
        callback: PatcherInsteadCallback;
        point: 'instead';
    };
    export default class Patcher {
        static patches: Map<object, Map<string, {
            original: any;
            patches: Patch[];
        }>>;
        static unpatchers: Map<string, (() => void)[]>;
        static applyPatches(object: object, property: string): void;
        static addPatch(object: object, property: string, patch: Patch): void;
        static getRemovePatch(id: string | null, object: object, property: string, patch: Patch): () => void;
        static after(id: string | null, object: object, property: string, callback: PatcherAfterCallback): () => void;
        static before(id: string | null, object: object, property: string, callback: PatcherBeforeCallback): () => void;
        static instead(id: string | null, object: object, property: string, callback: PatcherInsteadCallback): () => void;
        static unpatchAll(id: string): void;
    }
}
declare module "content/core/ui/ui" {
    import type * as React from 'react';
    import type * as ReactDOM from 'react-dom/client';
    export default class UI {
        static React: typeof React;
        static ReactDOM: typeof ReactDOM;
        static styles: Map<string, HTMLStyleElement[]>;
        static init(): void;
        static addStyles(id: string | null, styleString: string): () => void;
        static removeStyles(id: string): void;
        static addCoreStyles(): void;
    }
}
declare module "content/core/hotkeys/configurable.svelte" {
    import type { ConfigurableHotkeyOptions, HotkeyTrigger } from "types/hotkeys";
    type Callback = (e: KeyboardEvent) => void;
    export default class ConfigurableHotkey {
        id: string;
        category: string;
        title: string;
        preventDefault: boolean;
        callback: Callback;
        trigger: HotkeyTrigger | null;
        default?: HotkeyTrigger;
        pluginName?: string;
        constructor(id: string, callback: Callback, options: ConfigurableHotkeyOptions, pluginName?: string);
        reset(): void;
    }
}
declare module "content/core/hotkeys/hotkeys.svelte" {
    import type { ConfigurableHotkeyOptions, HotkeyOptions, HotkeyTrigger } from "types/hotkeys";
    import type { ConfigurableHotkeysState } from "types/state";
    import ConfigurableHotkey from "content/core/hotkeys/configurable.svelte";
    type Callback = (e: KeyboardEvent) => void;
    type DefaultHotkey = HotkeyOptions & {
        callback: Callback;
        id: string;
    };
    const _default_2: {
        hotkeys: DefaultHotkey[];
        configurableHotkeys: ConfigurableHotkey[];
        pressedKeys: Set<string>;
        pressed: Set<string>;
        savedHotkeys: ConfigurableHotkeysState;
        init(saved: ConfigurableHotkeysState): void;
        addHotkey(id: any, options: HotkeyOptions, callback: Callback): () => void;
        removeHotkeys(id: any): void;
        addConfigurableHotkey(id: string, options: ConfigurableHotkeyOptions, callback: Callback, pluginName?: string): () => void;
        removeConfigurableHotkey(id: string): void;
        removeConfigurableFromPlugin(pluginName: string): void;
        releaseAll(): void;
        checkHotkeys(e: KeyboardEvent): void;
        checkTrigger(e: KeyboardEvent, trigger: HotkeyTrigger): boolean;
        saveConfigurable(id: string, trigger: HotkeyTrigger | null): void;
        saveAllConfigurable(): void;
        updateConfigurable(id: string, trigger: HotkeyTrigger | null): void;
        updateAllConfigurable(hotkeys: ConfigurableHotkeysState): void;
    };
    export default _default_2;
}
declare module "content/core/ui/addPluginButtons" {
    export function setShowPluginButtons(value: boolean): void;
    export function addPluginButtons(): void;
}
declare module "content/core/storage.svelte" {
    import type { PluginStorage, Settings } from "types/state";
    const _default_3: {
        settings: Settings;
        values: PluginStorage;
        init(values: PluginStorage, settings: Settings): void;
        updateSetting(key: string, value: any, emit?: boolean): void;
        getPluginValue(id: string, key: string, defaultVal?: any): any;
        setPluginValue(id: string, key: string, value: any, emit?: boolean): void;
        deletePluginValue(id: string, key: string, emit?: boolean): void;
        deletePluginValues(id: string, emit?: boolean): void;
    };
    export default _default_3;
}
declare module "content/core/pluginManager/pluginManager.svelte" {
    import Plugin from "content/core/pluginManager/plugin.svelte";
    import type { PluginInfo } from "types/state";
    const _default_4: {
        plugins: Plugin[];
        destroyed: boolean;
        init(pluginInfo: PluginInfo[]): Promise<void>;
        getPlugin(name: string): Plugin;
        isEnabled(name: string): boolean;
        createPlugin(script: string, emit?: boolean): Promise<void>;
        deletePlugin(name: Plugin | string, emit?: boolean): void;
        deleteAll(emit?: boolean): void;
        setAll(enabled: boolean, emit?: boolean): void;
        getExports(pluginName: string): any;
        getHeaders(pluginName: string): {
            [x: string]: any;
        };
        getPluginNames(): string[];
        editPlugin(name: Plugin | string, script: string, emit?: boolean): Promise<void>;
        arrangePlugins(order: string[], emit?: boolean): void;
        setEnabled(name: Plugin | string, enabled: boolean, emit?: boolean): Promise<void>;
    };
    export default _default_4;
}
declare module "content/scopedApi" {
    export const uuidRegex: RegExp;
    interface ScopedInfo {
        id: string;
        onStop: (cb: () => void) => void;
        openSettingsMenu?: (cb: () => void) => void;
    }
    export default function setupScoped(): ScopedInfo;
}
declare module "content/core/libManager/lib.svelte" {
    export default class Lib {
        script: string;
        library: any;
        headers: Record<string, any>;
        usedBy: Set<string>;
        blobUuid: string | null;
        onStop: (() => void)[];
        enablePromise: Promise<boolean> | null;
        constructor(script: string, headers?: Record<string, any>);
        enable(initial?: boolean): Promise<boolean>;
        addUsed(pluginName: string): void;
        removeUsed(pluginName: string): void;
        disable(): void;
    }
}
declare module "content/utils" {
    import type Lib from "content/core/libManager/lib.svelte";
    export function log(...args: any[]): void;
    export function error(...args: any[]): void;
    export function validate(fnName: string, args: IArguments, ...schema: [string, string | object][]): boolean;
    export function splicer(array: any[], obj: any): () => void;
    export function confirmLibReload(libs: Lib[]): boolean;
    export function overrideKeydown(callback: (e: KeyboardEvent) => void): void;
    export function stopOverrideKeydown(): void;
    export function readUserFile(accept: string): Promise<string>;
}
declare module "content/core/parcel" {
    interface ModuleObject {
        id: string;
        exports: any;
    }
    /** @inline */
    export type Matcher = (exports: any, id: string) => boolean;
    interface LazyCheck {
        id: string;
        matcher: Matcher;
        callback: (exports: any) => any;
    }
    export default class Parcel {
        static _parcelModuleCache: Record<string, ModuleObject>;
        static _parcelModules: Record<string, any>;
        static lazyChecks: LazyCheck[];
        static init(): void;
        static query(matcher: Matcher, multiple?: boolean): any;
        static getLazy(id: string | null, matcher: Matcher, callback: (exports: any) => any, initial?: boolean): () => void;
        static stopLazy(id: string): void;
    }
}
declare module "content/core/internals" {
    export default class GimkitInternals {
        static stores: any;
        static notification: any;
        static platformerPhysics: any;
        static init(): void;
    }
}
declare module "content/core/net/net" {
    interface BlueboatConnection {
        type: "Blueboat";
        room: any;
    }
    interface ColyseusConnection {
        type: "Colyseus";
        room: any;
    }
    interface NoConnection {
        type: "None";
        room: null;
    }
    export type Connection = BlueboatConnection | ColyseusConnection | NoConnection;
    interface LoadCallback {
        callback: (type: Connection["type"]) => void;
        id: string;
    }
    const _default_5: {
        type: Connection["type"];
        room: Connection["room"];
        loaded: boolean;
        is1dHost: boolean;
        loadCallbacks: LoadCallback[];
        init(): void;
        waitForColyseusLoad(): void;
        send(channel: string, message: any): void;
        downloadLibraries(needsLibs: string[], confirmName?: string): Promise<void>;
        downloadLibrary(url: string): Promise<void>;
        onLoad(type: Connection["type"]): void;
        pluginOnLoad(id: string, callback: (type: Connection["type"]) => void): () => void;
        pluginOffLoad(id: string): void;
        readonly isHost: any;
        emit(event: import("eventemitter2").event | import("eventemitter2").eventNS, ...values: any[]): boolean;
        emitAsync(event: import("eventemitter2").event | import("eventemitter2").eventNS, ...values: any[]): Promise<any[]>;
        addListener(event: import("eventemitter2").event | import("eventemitter2").eventNS, listener: import("eventemitter2").ListenerFn): import("eventemitter2").Listener | any;
        on(event: import("eventemitter2").event | import("eventemitter2").eventNS, listener: import("eventemitter2").ListenerFn, options?: boolean | import("eventemitter2").OnOptions): import("eventemitter2").Listener | any;
        prependListener(event: import("eventemitter2").event | import("eventemitter2").eventNS, listener: import("eventemitter2").ListenerFn, options?: boolean | import("eventemitter2").OnOptions): import("eventemitter2").Listener | any;
        once(event: import("eventemitter2").event | import("eventemitter2").eventNS, listener: import("eventemitter2").ListenerFn, options?: true | import("eventemitter2").OnOptions): import("eventemitter2").Listener | any;
        prependOnceListener(event: import("eventemitter2").event | import("eventemitter2").eventNS, listener: import("eventemitter2").ListenerFn, options?: boolean | import("eventemitter2").OnOptions): import("eventemitter2").Listener | any;
        many(event: import("eventemitter2").event | import("eventemitter2").eventNS, timesToListen: number, listener: import("eventemitter2").ListenerFn, options?: boolean | import("eventemitter2").OnOptions): import("eventemitter2").Listener | any;
        prependMany(event: import("eventemitter2").event | import("eventemitter2").eventNS, timesToListen: number, listener: import("eventemitter2").ListenerFn, options?: boolean | import("eventemitter2").OnOptions): import("eventemitter2").Listener | any;
        onAny(listener: import("eventemitter2").EventAndListener): any;
        prependAny(listener: import("eventemitter2").EventAndListener): any;
        offAny(listener: import("eventemitter2").ListenerFn): any;
        removeListener(event: import("eventemitter2").event | import("eventemitter2").eventNS, listener: import("eventemitter2").ListenerFn): any;
        off(event: import("eventemitter2").event | import("eventemitter2").eventNS, listener: import("eventemitter2").ListenerFn): any;
        removeAllListeners(event?: import("eventemitter2").event | import("eventemitter2").eventNS): any;
        setMaxListeners(n: number): void;
        getMaxListeners(): number;
        eventNames(nsAsArray?: boolean): (import("eventemitter2").event | import("eventemitter2").eventNS)[];
        listenerCount(event?: import("eventemitter2").event | import("eventemitter2").eventNS): number;
        listeners(event?: import("eventemitter2").event | import("eventemitter2").eventNS): import("eventemitter2").ListenerFn[];
        listenersAny(): import("eventemitter2").ListenerFn[];
        waitFor(event: import("eventemitter2").event | import("eventemitter2").eventNS, timeout?: number): import("eventemitter2").CancelablePromise<any[]>;
        waitFor(event: import("eventemitter2").event | import("eventemitter2").eventNS, filter?: import("eventemitter2").WaitForFilter): import("eventemitter2").CancelablePromise<any[]>;
        waitFor(event: import("eventemitter2").event | import("eventemitter2").eventNS, options?: import("eventemitter2").WaitForOptions): import("eventemitter2").CancelablePromise<any[]>;
        listenTo(target: import("eventemitter2").GeneralEventEmitter, events: import("eventemitter2").event | import("eventemitter2").eventNS, options?: import("eventemitter2").ListenToOptions): any;
        listenTo(target: import("eventemitter2").GeneralEventEmitter, events: import("eventemitter2").event[], options?: import("eventemitter2").ListenToOptions): any;
        listenTo(target: import("eventemitter2").GeneralEventEmitter, events: Object, options?: import("eventemitter2").ListenToOptions): any;
        stopListeningTo(target?: import("eventemitter2").GeneralEventEmitter, event?: import("eventemitter2").event | import("eventemitter2").eventNS): Boolean;
        hasListeners(event?: String): Boolean;
    };
    export default _default_5;
}
declare module "content/api/hotkeys" {
    import type { HotkeyOptions, ConfigurableHotkeyOptions } from "types/hotkeys";
    interface OldConfigurableOptions {
        category: string;
        title: string;
        preventDefault?: boolean;
        defaultKeys?: Set<string>;
    }
    /** @inline */
    type KeyboardCallback = (e: KeyboardEvent) => void;
    class BaseHotkeysApi {
        /**
         * Releases all keys, needed if a hotkey opens something that will
         * prevent keyup events from being registered, such as an alert
         */
        releaseAll(): void;
        /** Which key codes are currently being pressed */
        get pressed(): Set<string>;
        /**
         * @deprecated Use {@link pressed} instead
         * @hidden
         */
        get pressedKeys(): Set<string>;
    }
    class HotkeysApi extends BaseHotkeysApi {
        /**
         * Adds a hotkey with a given id
         * @returns A function to remove the hotkey
         */
        addHotkey(id: string, options: HotkeyOptions, callback: KeyboardCallback): () => void;
        /** Removes all hotkeys with a given id */
        removeHotkeys(id: string): void;
        /**
         * Adds a hotkey which can be changed by the user
         * @param id A unique id for the hotkey, such as `myplugin-myhotkey`
         * @returns A function to remove the hotkey
         */
        addConfigurableHotkey(id: string, options: ConfigurableHotkeyOptions, callback: KeyboardCallback): () => void;
        /** Removes a configurable hotkey with a given id */
        removeConfigurableHotkey(id: string): void;
        /**
         * @deprecated Use {@link addHotkey} instead
         * @hidden
         */
        add(keys: Set<string>, callback: KeyboardCallback, preventDefault?: boolean): void;
        /**
         * @deprecated Use {@link removeHotkeys} instead
         * @hidden
         */
        remove(keys: Set<string>): void;
        /**
         * @deprecated Use {@link addConfigurableHotkey} instead
         * @hidden
         */
        addConfigurable(pluginName: string, hotkeyId: string, callback: KeyboardCallback, options: OldConfigurableOptions): void;
        /**
         * @deprecated Use {@link removeConfigurableHotkeys} instead
         * @hidden
         */
        removeConfigurable(pluginName: string, hotkeyId: string): void;
    }
    class ScopedHotkeysApi extends BaseHotkeysApi {
        private readonly id;
        constructor(id: string);
        /**
         * Adds a hotkey which will fire when certain keys are pressed
         * @returns A function to remove the hotkey
         */
        addHotkey(options: HotkeyOptions, callback: KeyboardCallback): () => void;
        /**
         * Adds a hotkey which can be changed by the user
         * @returns A function to remove the hotkey
         */
        addConfigurableHotkey(options: ConfigurableHotkeyOptions, callback: KeyboardCallback): () => void;
    }
    export { HotkeysApi, ScopedHotkeysApi };
}
declare module "content/api/parcel" {
    import type { Matcher } from "content/core/parcel";
    class BaseParcelApi {
        /**
         * Gets a module based on a filter, returns null if none are found
         * Be cautious when using this- plugins will often run before any modules load in,
         * meaning that if this is run on startup it will likely return nothing.
         * Consider using getLazy instead.
         */
        query(matcher: Matcher): any;
        /**
         * Returns an array of all loaded modules matching a filter
         * Be cautious when using this- plugins will often run before any modules load in,
         * meaning that if this is run on startup it will likely return nothing.
         * Consider using getLazy instead.
         */
        queryAll(matcher: Matcher): any[];
    }
    class ParcelApi extends BaseParcelApi {
        /**
         * Waits for a module to be loaded, then runs a callback
         * @returns A function to cancel waiting for the module
         */
        getLazy(id: string, matcher: Matcher, callback: (exports: any) => any, initial?: boolean): () => void;
        /** Cancels any calls to getLazy with the same id */
        stopLazy(id: string): void;
        /**
         * @deprecated Use {@link getLazy} instead
         * @hidden
         */
        get interceptRequire(): (id: string, matcher: Matcher, callback: (exports: any) => any, initial?: boolean) => () => void;
        /**
         * @deprecated Use {@link stopLazy} instead
         * @hidden
         */
        get stopIntercepts(): (id: string) => void;
    }
    class ScopedParcelApi extends BaseParcelApi {
        private readonly id;
        constructor(id: string);
        /**
         * Waits for a module to be loaded, then runs a callback
         * @returns A function to cancel waiting for the module
         */
        getLazy(matcher: Matcher, callback: (exports: any) => any, initial?: boolean): () => void;
    }
    export { ParcelApi, ScopedParcelApi };
}
declare module "content/api/net" {
    import type { Connection } from "content/core/net/net";
    import EventEmitter from "eventemitter2";
    class BaseNetApi extends EventEmitter {
        constructor();
        /** Which type of server the client is currently connected to */
        get type(): Connection["type"];
        /** The room that the client is connected to, or null if there is no connection */
        get room(): Connection["room"];
        /** Whether the user is the one hosting the current game */
        get isHost(): any;
        /** Sends a message to the server on a specific channel */
        send(channel: string, message: any): void;
    }
    /**
     * The net api extends [EventEmitter2](https://github.com/EventEmitter2/EventEmitter2)
     * and uses wildcards with ":" as a delimiter.
     *
     * The following events are emitted:
     *
     * ```ts
     * // fired when data is recieved on a certain channel
     * net.on(CHANNEL, (data, editFn) => {})
     *
     * // fired when data is sent on a certain channel
     * net.on(send:CHANNEL, (data, editFn) => {})
     *
     * // fired when the game loads with a certain type
     * net.on(load:TYPE, (type) => {})
     *
     * // you can also use wildcards, eg
     * net.on("send:*", () => {})
     * ```
     */
    class NetApi extends BaseNetApi {
        constructor();
        /**
         * Runs a callback when the game is loaded, or runs it immediately if the game has already loaded
         * @returns A function to cancel waiting for load
         */
        onLoad(id: string, callback: (type: Connection["type"]) => void): () => void;
        /** Cancels any calls to {@link onLoad} with the same id */
        offLoad(id: string): void;
        /**
         * @deprecated Methods for both transports are now on the base net api
         * @hidden
         */
        get colyseus(): this;
        /**
         * @deprecated Methods for both transports are now on the base net api
         * @hidden
         */
        get blueboat(): this;
        /** @hidden */
        private wrappedListeners;
        /**
         * @deprecated use net.on
         * @hidden
         */
        addEventListener(channel: string, callback: (...args: any[]) => void): void;
        /**
         * @deprecated use net.off
         * @hidden
         */
        removeEventListener(channel: string, callback: (...args: any[]) => void): void;
    }
    /**
     * The net api extends [EventEmitter2](https://github.com/EventEmitter2/EventEmitter2)
     * and uses wildcards with ":" as a delimiter.
     *
     * The following events are emitted:
     *
     * ```ts
     * // fired when data is recieved on a certain channel
     * net.on(CHANNEL, (data, editFn) => {})
     *
     * // fired when data is sent on a certain channel
     * net.on(send:CHANNEL, (data, editFn) => {})
     *
     * // fired when the game loads with a certain type
     * net.on(load:TYPE, (type) => {})
     *
     * // you can also use wildcards, eg
     * net.on("send:*", () => {})
     * ```
     */
    class ScopedNetApi extends BaseNetApi {
        private readonly id;
        constructor(id: string);
        /**
         * Runs a callback when the game is loaded, or runs it immediately if the game has already loaded
         * @returns A function to cancel waiting for load
         */
        onLoad(callback: (type: Connection["type"]) => void): () => void;
    }
    export { NetApi, ScopedNetApi };
}
declare module "content/ui/stores" {
    export let focusTrapEnabled: import("svelte/store").Writable<boolean>;
}
declare module "content/core/ui/modal" {
    import type { ReactElement } from "react";
    interface ModalButton {
        text: string;
        style?: "primary" | "danger" | "close";
        onClick?: (event: MouseEvent) => boolean | void;
    }
    /** @inline */
    export interface ModalOptions {
        id: string;
        title: string;
        style: string;
        className: string;
        closeOnBackgroundClick: boolean;
        buttons: ModalButton[];
        onClosed: () => void;
    }
    export default function showModal(content: HTMLElement | ReactElement, options?: Partial<ModalOptions>): () => void;
}
declare module "content/api/ui" {
    import type { ModalOptions } from "content/core/ui/modal";
    import type { ReactElement } from "react";
    class BaseUIApi {
        /** Shows a customizable modal to the user */
        showModal(element: HTMLElement | ReactElement, options?: Partial<ModalOptions>): void;
    }
    class UIApi extends BaseUIApi {
        /**
         * Adds a style to the DOM
         * @returns A function to remove the styles
         */
        addStyles(id: string, style: string): () => void;
        /** Remove all styles with a given id */
        removeStyles(id: string): void;
    }
    class ScopedUIApi extends BaseUIApi {
        private readonly id;
        constructor(id: string);
        /**
         * Adds a style to the DOM
         * @returns A function to remove the styles
         */
        addStyles(style: string): () => void;
    }
    export { UIApi, ScopedUIApi };
}
declare module "content/api/storage" {
    class StorageApi {
        /** Gets a value that has previously been saved */
        getValue(pluginName: string, key: string, defaultValue?: any): any;
        /** Sets a value which can be retrieved later, through reloads */
        setValue(pluginName: string, key: string, value: any): void;
        /** Removes a value which has been saved */
        deleteValue(pluginName: string, key: string): void;
        /**
         * @deprecated use {@link deleteValue}
         * @hidden
         */
        get removeValue(): (pluginName: string, key: string) => void;
    }
    class ScopedStorageApi {
        private readonly id;
        constructor(id: string);
        /** Gets a value that has previously been saved */
        getValue(key: string, defaultValue?: any): any;
        /** Sets a value which can be retrieved later, persisting through reloads */
        setValue(key: string, value: any): void;
        /** Removes a value which has been saved */
        deleteValue(key: string): void;
    }
    export { StorageApi, ScopedStorageApi };
}
declare module "content/api/patcher" {
    import type { PatcherAfterCallback, PatcherBeforeCallback, PatcherInsteadCallback } from "content/core/patcher";
    class PatcherApi {
        /**
         * Runs a callback after a function on an object has been run
         * @returns A function to remove the patch
         */
        after(id: string, object: any, method: string, callback: PatcherAfterCallback): () => void;
        /**
         * Runs a callback before a function on an object has been run.
         * Return true from the callback to prevent the function from running
         * @returns A function to remove the patch
         */
        before(id: string, object: any, method: string, callback: PatcherBeforeCallback): () => void;
        /**
         * Runs a function instead of a function on an object
         * @returns A function to remove the patch
         */
        instead(id: string, object: any, method: string, callback: PatcherInsteadCallback): () => void;
        /** Removes all patches with a given id */
        unpatchAll(id: string): void;
    }
    class ScopedPatcherApi {
        private readonly id;
        constructor(id: string);
        /**
         * Runs a callback after a function on an object has been run
         * @returns A function to remove the patch
         */
        after(object: any, method: string, callback: PatcherAfterCallback): () => void;
        /**
         * Runs a callback before a function on an object has been run.
         * Return true from the callback to prevent the function from running
         * @returns A function to remove the patch
         */
        before(object: any, method: string, callback: PatcherBeforeCallback): () => void;
        /**
         * Runs a function instead of a function on an object
         * @returns A function to remove the patch
         */
        instead(object: any, method: string, callback: PatcherInsteadCallback): () => void;
    }
    export { PatcherApi, ScopedPatcherApi };
}
declare module "content/api/libs" {
    class LibsApi {
        /** A list of all the libraries installed */
        get list(): string[];
        /** Gets whether or not a plugin is installed and enabled */
        isEnabled(name: string): boolean;
        /** Gets the headers of a library, such as version, author, and description */
        getHeaders(name: string): {
            [x: string]: any;
        };
        /** Gets the exported values of a library */
        get(name: string): any;
    }
    export default LibsApi;
}
declare module "content/api/plugins" {
    class PluginsApi {
        /** A list of all the plugins installed */
        get list(): string[];
        /** Whether a plugin exists and is enabled */
        isEnabled(name: string): boolean;
        /** Gets the headers of a plugin, such as version, author, and description */
        getHeaders(name: string): {
            [x: string]: any;
        };
        /** Gets the exported values of a plugin, if it has been enabled */
        get(name: string): any;
        /**
         * @deprecated Use {@link get} instead
         * @hidden
         */
        getPlugin(name: string): {
            return: any;
        };
    }
    export default PluginsApi;
}
declare module "content/api/api" {
    import type { Connection } from "content/core/net/net";
    import { HotkeysApi, ScopedHotkeysApi } from "content/api/hotkeys";
    import { ParcelApi, ScopedParcelApi } from "content/api/parcel";
    import { NetApi, ScopedNetApi } from "content/api/net";
    import { UIApi, ScopedUIApi } from "content/api/ui";
    import { StorageApi, ScopedStorageApi } from "content/api/storage";
    import { PatcherApi, ScopedPatcherApi } from "content/api/patcher";
    import LibsApi from "content/api/libs";
    import PluginsApi from "content/api/plugins";
    class Api {
        /** Functions used to modify Gimkit's internal modules */
        static parcel: Readonly<ParcelApi>;
        /** Functions to listen for key combinations */
        static hotkeys: Readonly<HotkeysApi>;
        /**
         * Ways to interact with the current connection to the server,
         * and functions to send general requests
         */
        static net: Readonly<NetApi & Connection>;
        /** Functions for interacting with the DOM */
        static UI: Readonly<UIApi>;
        /** Functions for persisting data between reloads */
        static storage: Readonly<StorageApi>;
        /** Functions for intercepting the arguments and return values of functions */
        static patcher: Readonly<PatcherApi>;
        /** Methods for getting info on libraries */
        static libs: Readonly<LibsApi>;
        /** Gets the exported values of a library */
        static lib: (name: string) => any;
        /** Methods for getting info on plugins */
        static plugins: Readonly<PluginsApi>;
        /** Gets the exported values of a plugin, if it has been enabled */
        static plugin: (name: string) => any;
        /** Gimkit's internal react instance */
        static get React(): typeof import("react");
        /** Gimkit's internal reactDom instance */
        static get ReactDOM(): typeof import("react-dom/client");
        /** A variety of Gimkit internal objects available in 2d gamemodes */
        static get stores(): any;
        /**
         * Gimkit's notification object, only available when joining or playing a game
         *
         * {@link https://ant.design/components/notification}
         */
        static get notification(): any;
        /**
         * @deprecated No longer supported
         * @hidden
         */
        static get contextMenu(): {
            showContextMenu: () => void;
            createReactContextMenu: () => void;
        };
        /**
         * @deprecated No longer supported
         * @hidden
         */
        static get platformerPhysics(): any;
        /**
         * @deprecated The api no longer emits events. Use GL.net.loaded to listen to load events
         * @hidden
         */
        static addEventListener(type: string, callback: () => void): void;
        /**
         * @deprecated The api no longer emits events
         * @hidden
         */
        static removeEventListener(type: string, callback: () => void): void;
        /**
         * @deprecated Use {@link plugins} instead
         * @hidden
         */
        static get pluginManager(): Readonly<PluginsApi>;
        constructor();
        /** Functions used to modify Gimkit's internal modules */
        parcel: Readonly<ScopedParcelApi>;
        /** Functions to listen for key combinations */
        hotkeys: Readonly<ScopedHotkeysApi>;
        /**
         * Ways to interact with the current connection to the server,
         * and functions to send general requests
         */
        net: Readonly<ScopedNetApi & Connection>;
        /** Functions for interacting with the DOM */
        UI: Readonly<ScopedUIApi>;
        /** Functions for persisting data between reloads */
        storage: Readonly<ScopedStorageApi>;
        /** Functions for intercepting the arguments and return values of functions */
        patcher: Readonly<ScopedPatcherApi>;
        /** Methods for getting info on libraries */
        libs: Readonly<LibsApi>;
        /** Gets the exported values of a library */
        lib: (name: string) => any;
        /** Methods for getting info on plugins */
        plugins: Readonly<PluginsApi>;
        /** Gets the exported values of a plugin, if it has been enabled */
        plugin: (name: string) => any;
        /** Gimkit's internal react instance */
        get React(): typeof import("react");
        /** Gimkit's internal reactDom instance */
        get ReactDOM(): typeof import("react-dom/client");
        /** A variety of gimkit internal objects available in 2d gamemodes */
        get stores(): any;
        /**
         * Gimkit's notification object, only available when joining or playing a game
         *
         * {@link https://ant.design/components/notification}
         */
        get notification(): any;
        /** Run a callback when the plugin or library is disabled */
        onStop: (callback: () => void) => void;
        /**
         * Run a callback when the plugin's settings menu button is clicked
         *
         * This function is not available for libraries
         */
        openSettingsMenu: (callback: () => void) => void;
    }
    export default Api;
}
