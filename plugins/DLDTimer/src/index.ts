/// <reference types='gimloader' />

import { onceOrIfLoaded } from "./util";
// @ts-ignore
import Settings from './settings/Settings.svelte';
// @ts-ignore
import styles from './styles.scss';
import Autosplitter from './autosplitter';

GL.UI.addStyles("DLD Timer", styles);

let autosplitter = new Autosplitter();

let isDestroyed = false;

onceOrIfLoaded(() => {
    if(isDestroyed) return;

    autosplitter.init();
})

export function onStop() {
    isDestroyed = true;
    autosplitter.destroy();
    GL.UI.removeStyles("DLD Timer");
    GL.patcher.unpatchAll("DLD Timer");
}

export function openSettingsMenu() {
    let div = document.createElement("div");
    new Settings({
        target: div,
        props: {
            autosplitter
        }
    });

    GL.UI.showModal(div, {
        title: "Manage DLD Timer data",
        buttons: [{ text: "Close", style: "close" }],
        id: "DLD Timer Settings",
        style: "min-width: min(600px, 90%)",
        closeOnBackgroundClick: false,
        onClosed: () => {
            autosplitter.reset();
        }
    });
}