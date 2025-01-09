import type * as React from 'react';
import type * as ReactDOM from 'react-dom/client';
import Parcel from "$core/parcel";
import { addPluginButtons } from './addPluginButtons';

export default class UI {
    static React: typeof React;
    static ReactDOM: typeof ReactDOM;
    static styles: Map<string, HTMLStyleElement[]> = new Map();

    static init() {
        Parcel.getLazy(null, exports => exports?.useState, exports => {
            if (this.React) return;
            this.React = exports;
        });

        Parcel.getLazy(null, exports => exports?.createRoot, exports => {
            if (this.ReactDOM) return;
            this.ReactDOM = exports;
        });

        addPluginButtons();
    }

    static async addStyles(id: string | null, styleString: string) {
        let style = document.createElement('style');
        style.innerHTML = styleString;

        // wait for document to be ready
        if(!document.head) await new Promise(res => document.addEventListener('DOMContentLoaded', res, { once: true }));
        document.head.appendChild(style);

        if(id === null) return;

        // add to map
        if(!this.styles.has(id)) this.styles.set(id, []);
        this.styles.get(id)?.push(style);
    }

    static removeStyles(id: string) {
        if(!this.styles.has(id)) return;

        for(let style of this.styles.get(id)!) {
            style.remove();
        }

        this.styles.delete(id);
    }
}