import type * as React from 'react';
import type * as ReactDOM from 'react-dom/client';
import Parcel from './parcel/parcel';
import Net from './net/net';
import HotkeyManager from './hotkeyManager/hotkeyManager';
import showModal from './ui/modal';
import { addStyles, removeStyles } from './ui/addStyles';
import Patcher from './patcher/patcher';
import ContextMenu from './contextMenu/contextMenu';
import PluginManager from './pluginManager/pluginManager';
import Storage from './storage/storage';
export declare class Gimloader extends EventTarget {
    version: string;
    React: typeof React;
    ReactDOM: typeof ReactDOM;
    notification: any;
    modules: Record<string, any>;
    stores: any;
    platformerPhysics: any;
    pluginManager: PluginManager;
    patcher: Patcher;
    parcel: Parcel;
    net: Net;
    hotkeys: HotkeyManager;
    contextMenu: ContextMenu;
    storage: Storage;
    UI: {
        showModal: typeof showModal;
        addStyles: typeof addStyles;
        removeStyles: typeof removeStyles;
    };
    constructor();
    addStyleSheets(): void;
    exposeValues(): void;
    getReact(): void;
    awaitColyseusLoad(): void;
}
