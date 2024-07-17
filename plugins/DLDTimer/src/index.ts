/// <reference types='gimloader' />

import { resetCoordinates, summitCoordinates } from './constants';
import UI from './ui';
import { onceOrIfLoaded } from "./util";
// @ts-ignore
import styles from './styles.scss';
import Settings from './Settings';

GL.UI.addStyles("DLD Timer", styles);

let ui = new UI();

let isDestroyed = false;

onceOrIfLoaded(() => {
    if(isDestroyed) return;
    if(document.readyState === "complete") ui.create();
    else document.addEventListener("DOMContentLoaded", () => ui.create());

    let worldManager = GL.stores.phaser.scene.worldManager;
    let body = GL.stores.phaser.mainCharacter.body;
    let summit = 0;

    // whenever a frame passes check if we've reached any summits
    GL.patcher.after("DLD Timer", worldManager, 'update', () => {
        // check if we're at a position where we should reset
        if(summit > 0 && body.x < resetCoordinates.x && body.y > resetCoordinates.y) {
            // kind of cheaty way to reset the UI
            ui.remove();
            ui = new UI();
            ui.create();
            summit = 0;
            return;
        }

        if(summit > summitCoordinates.length - 1) return;
        if(summit === 0) {
            if(body.x > summitCoordinates[0].x && body.y < summitCoordinates[0].y + 10) {
                summit = 1;
                ui.start();
            }
        } else if(
            ((summitCoordinates[summit].direction === "right" &&
            body.x > summitCoordinates[summit].x) ||
            (summitCoordinates[summit].direction === "left" &&
            body.x < summitCoordinates[summit].x)) &&
            body.y < summitCoordinates[summit].y + 10
        ) {
            summit++;
            ui.split();
        }
        ui.onUpdate();
    })
})

export function onStop() {
    isDestroyed = true;
    ui.remove();
    GL.UI.removeStyles("DLD Timer");
    GL.patcher.unpatchAll("DLD Timer");
}

export function openSettingsMenu() {
    GL.UI.showModal(GL.React.createElement(Settings, { ui }), {
        title: "Manage DLD Timer data",
        buttons: [{ text: "Close", style: "close" }],
        id: "DLD Timer Settings",
        style: "min-width: min(600px, 90%)"
    });
}