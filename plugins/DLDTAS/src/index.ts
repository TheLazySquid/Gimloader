/// <reference types="gimloader" />

// @ts-ignore
import styles from './styles.scss';
import { createUI } from "./ui";

GL.lib("DLDUtils").setLaserWarningEnabled(false);
GL.UI.addStyles("TAS", styles);

let startTasBtn = document.createElement("button");
startTasBtn.id = "startTasBtn";
startTasBtn.innerText = "Start TAS";

startTasBtn.addEventListener("click", () => startTasBtn.remove());

GL.addEventListener("loadEnd", () => {
    document.body.appendChild(startTasBtn);
})

GL.parcel.interceptRequire("TAS", exports => exports?.PhysicsManager, exports => {
    let physManClass = exports.PhysicsManager;
    delete exports.PhysicsManager;
    exports.PhysicsManager = class extends physManClass {
        constructor() {
            super(...arguments);
            startTasBtn.addEventListener("click", () => {
                createUI(this)
            });
        }
    }
})

export function onStop() {
    GL.UI.removeStyles("TAS")
    GL.parcel.stopIntercepts("TAS")
    GL.patcher.unpatchAll("TAS")
}