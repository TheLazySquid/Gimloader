import type * as React from 'react';
import type * as ReactDOM from 'react-dom/client';
import Parcel from './parcel/parcel';
import Net from './net/net';
import HotkeyManager from './hotkeyManager/hotkeyManager';
import showModal from './ui/modal';
import { addStyles, removeStyles } from './ui/addStyles';
import Patcher from './patcher/patcher';
export declare class Gimloader extends EventTarget {
    version: string;
    React: typeof React;
    ReactDOM: typeof ReactDOM;
    notification: any;
    modules: Record<string, any>;
    stores: any;
    platformerPhysics: any;
    parcel: Parcel;
    net: Net;
    hotkeys: HotkeyManager;
    patcher: Patcher;
    UI: {
        showModal: typeof showModal;
        addStyles: typeof addStyles;
        removeStyles: typeof removeStyles;
    };
    constructor();
    injectSheetsAndScripts(): void;
    exposeValues(): void;
    getReact(): void;
}