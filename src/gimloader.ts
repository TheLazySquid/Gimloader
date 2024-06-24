import { version } from '../package.json';

import type * as React from 'react';
import type * as ReactDOM from 'react-dom/client';

import styles from './css/styles.scss';
import codeCakeStyles from 'codecake/codecake.css';
import { log, onGimkit } from './util';
import { addPluginButtons } from './ui/addPluginButtons';
import Parcel from './parcel/parcel';
import Net from './net/net';
import HotkeyManager from './hotkeyManager/hotkeyManager';
import showModal from './ui/modal';
import { addStyles, removeStyles } from './ui/addStyles';
import Patcher from './patcher/patcher';
import { gimhookPolyfill } from './gimhookPolyfill';
import ContextMenu from './contextMenu/contextMenu';
import PluginManager from './pluginManager/pluginManager';
import Storage from './storage/storage';
import makeLibManager from './lib/libManager';

export class Gimloader extends EventTarget {
    version: string = version;

    React: typeof React;
    ReactDOM: typeof ReactDOM;
    notification: any;
    modules: Record<string, any> = {};

    stores: any;
    platformerPhysics: any;

    lib = makeLibManager();
    pluginManager: PluginManager = new PluginManager(this, onGimkit);
    patcher: Patcher = new Patcher();
    parcel: Parcel = new Parcel(this);
    net: Net = new Net(this);
    hotkeys: HotkeyManager = new HotkeyManager();
    contextMenu: ContextMenu = new ContextMenu(this);
    storage: Storage = new Storage();
    UI = {
        showModal,
        addStyles,
        removeStyles
    }

    constructor() {
        super();
        log('Gimloader v' + this.version + ' loaded');

        this.addStyleSheets();
        this.getReact();
        this.exposeValues();

        addPluginButtons(this);

        // create a polyfill for gimhook
        gimhookPolyfill(this);
    }

    addStyleSheets() {
        this.UI.addStyles(null, styles);
        this.UI.addStyles(null, codeCakeStyles);
    }

    exposeValues() {
        // window.stores
        this.parcel.interceptRequire(null, exports => exports?.default?.characters, exports => {
            this.stores = exports.default;
            window.stores = exports.default;
            unsafeWindow.stores = exports.default;
        })

        // window.platformerPhysics
        this.parcel.interceptRequire(null, exports => exports?.CharacterPhysicsConsts, exports => {
            this.platformerPhysics = exports.CharacterPhysicsConsts;
            window.platformerPhysics = exports.CharacterPhysicsConsts;
            unsafeWindow.platformerPhysics = exports.CharacterPhysicsConsts;
        })
    }

    getReact() {
        this.parcel.interceptRequire(null, exports => exports?.useState, exports => {
            if (this.React) return;
            this.React = exports;

            if(this.ReactDOM) {
                this.dispatchEvent(new CustomEvent('reactLoaded'));
            }
        })

        this.parcel.interceptRequire(null, exports => exports?.createRoot, exports => {
            if (this.ReactDOM) return;
            this.ReactDOM = exports;

            if(this.React) {
                this.dispatchEvent(new CustomEvent('reactLoaded'));
            }
        })

        this.parcel.interceptRequire(null, exports => exports?.default?.useNotification, exports => {
            this.notification = exports.default;
        })
    }

    awaitColyseusLoad() {
        let loading = GL.stores.loading;
        let me = GL.stores.me;
        
        // error message
        if(me.nonDismissMessage.title && me.nonDismissMessage.description) return;

        if(
            loading.completedInitialLoad &&
            loading.loadedInitialTerrain &&
            loading.loadedInitialDevices &&
            me.completedInitialPlacement
        ) {
            this.dispatchEvent(new CustomEvent('loadEnd'));
        } else {
            setTimeout(() => this.awaitColyseusLoad(), 50);
        }
    }
}