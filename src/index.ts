import { version } from '../package.json';

import type * as React from 'react';
import type * as ReactDOM from 'react-dom/client';

// @ts-ignore vscode struggles to find the declaration in ../main.d.ts
import styles from './css/styles.scss';
// @ts-ignore
import codeCakeStyles from 'codecake/codecake.css';
import { getUnsafeWindow, log } from './util';
import { addPluginButtons } from './ui/addPluginButtons';
import Parcel from './parcel/parcel';
import Net from './net/net';
import HotkeyManager from './hotkeyManager/hotkeyManager';
import showModal from './ui/modal';
import { addStyles, removeStyles } from './ui/addStyles';
import Patcher from './patcher/patcher';
import { gimhookPolyfill } from './gimhookPolyfill';
import ContextMenu from './contextMenu/contextMenu';

export class Gimloader extends EventTarget {
    version: string = version;

    React: typeof React;
    ReactDOM: typeof ReactDOM;
    notification: any;
    modules: Record<string, any> = {};

    stores: any;
    platformerPhysics: any;

    parcel: Parcel = new Parcel();
    net: Net = new Net(this);
    hotkeys: HotkeyManager = new HotkeyManager();
    patcher: Patcher = new Patcher();
    contextMenu: ContextMenu = new ContextMenu(this);
    UI = {
        showModal,
        addStyles,
        removeStyles
    }

    constructor() {
        super();
        log('GimkitLoader v' + this.version + ' loaded');

        this.injectSheetsAndScripts();
        this.getReact();
        this.exposeValues();

        addPluginButtons(this);

        // create a polyfill for gimhook
        gimhookPolyfill(this);
    }

    injectSheetsAndScripts() {
        this.UI.addStyles(null, styles);
        this.UI.addStyles(null, codeCakeStyles);
    }

    exposeValues() {
        // window.stores
        this.parcel.interceptRequire(null, exports => exports?.default?.characters, exports => {
            this.stores = exports.default;
            window.stores = exports.default;
            getUnsafeWindow().stores = exports.default;
        })

        // window.platformerPhysics
        this.parcel.interceptRequire(null, exports => exports?.CharacterPhysicsConsts, exports => {
            this.platformerPhysics = exports.CharacterPhysicsConsts;
            window.platformerPhysics = exports.CharacterPhysicsConsts;
            getUnsafeWindow().platformerPhysics = exports.CharacterPhysicsConsts;
        })
    }

    getReact() {
        this.parcel.interceptRequire(null, exports => exports?.useState, exports => {
            if (this.React) return;
            this.React = exports;
        })

        this.parcel.interceptRequire(null, exports => exports?.createRoot, exports => {
            if (this.ReactDOM) return;
            this.ReactDOM = exports;
        })

        this.parcel.interceptRequire(null, exports => exports?.default?.useNotification, exports => {
            this.notification = exports.default;
        })
    }
}

let loader = new Gimloader();
window.GL = loader;
getUnsafeWindow().GL = loader;