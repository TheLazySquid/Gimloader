/// <reference types='gimloader' />

import { onceOrIfLoaded } from "./util";
// @ts-ignore
import styles from './styles.scss';
import Settings from './Settings';
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
    GL.UI.showModal(GL.React.createElement(Settings, { ui: autosplitter.timer }), {
        title: "Manage DLD Timer data",
        buttons: [{ text: "Close", style: "close" }],
        id: "DLD Timer Settings",
        style: "min-width: min(600px, 90%)"
    });
}