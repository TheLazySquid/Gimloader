import type * as React from 'react';
import type * as ReactDOM from 'react-dom/client';
import { setShowPluginButtons } from './ui/addPluginButtons';
import Parcel from './parcel/parcel';
import Net from './net/net';
import HotkeyManager from './hotkeyManager/hotkeyManager';
import showModal from './ui/modal';
import { addStyles, removeStyles } from './ui/addStyles';
import Patcher from './patcher/patcher';
import ContextMenu from './contextMenu/contextMenu';
import PluginManager from './pluginManager/pluginManager';
import Storage from './storage/storage';
import Poller from './net/poller';
export declare class Gimloader extends EventTarget {
    version: string;
    React: typeof React;
    ReactDOM: typeof ReactDOM;
    notification: any;
    stores: any;
    /** @deprecated No longer supported */
    platformerPhysics: any;
    settings: {
        autoUpdate: boolean;
        autoDownloadMissingLibs: boolean;
        menuView: string;
    };
    parcel: Parcel;
    lib: import("./lib/libManager").LibManagerType;
    net: Net;
    pluginManager: PluginManager;
    patcher: Patcher;
    poller: Poller;
    hotkeys: HotkeyManager;
    contextMenu: ContextMenu;
    storage: Storage;
    UI: {
        showModal: typeof showModal;
        addStyles: typeof addStyles;
        removeStyles: typeof removeStyles;
        showPluginButtons: boolean;
        setShowPluginButtons: typeof setShowPluginButtons;
    };
    constructor();
    addStyleSheets(): void;
    exposeValues(): void;
    getReact(): void;
    awaitColyseusLoad(): void;
}
