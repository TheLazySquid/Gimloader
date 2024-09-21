import { onceOrIfLoaded } from "./util";
// @ts-ignore
import Settings from './settings/Settings.svelte';
// @ts-ignore
import styles from './styles.scss';
import { Autosplitter } from "./splitters/autosplitter";
import FishtopiaAutosplitter from "./splitters/fishtopia";
import DLDAutosplitter from "./splitters/DLD";
import OneWayOutAutosplitter from "./splitters/oneWayOut";

GL.UI.addStyles("Autosplitter", styles);

let isDestroyed = false;

let autosplitter: Autosplitter;
let gamemodeDetector = GL.lib("GamemodeDetector");

onceOrIfLoaded(() => {
    if(isDestroyed) return;

    let gamemode = gamemodeDetector.currentGamemode();
    if(gamemode === "Don't Look Down") {
        autosplitter = new DLDAutosplitter();
    } else if(gamemode === "Fishtopia") {
        autosplitter = new FishtopiaAutosplitter();        
    } else if(gamemode === "One Way Out") {
        autosplitter = new OneWayOutAutosplitter();
    }
})

export function onStop() {
    isDestroyed = true;
    autosplitter?.destroy();
    GL.UI.removeStyles("Autosplitter");
    GL.patcher.unpatchAll("Autosplitter");
}

export function openSettingsMenu() {
    let div = document.createElement("div");
    // @ts-ignore
    let settings = new Settings({
        target: div
    });

    GL.UI.showModal(div, {
        title: "Manage Autosplitter data",
        buttons: [{ text: "Close", style: "close" }],
        id: "Autosplitter Settings",
        style: "min-width: min(600px, 90%); height: 90%;",
        closeOnBackgroundClick: false,
        onClosed: () => {
            settings.save();
            autosplitter?.loadData();
            autosplitter?.reset();
        }
    });
}