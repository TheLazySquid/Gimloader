import GL from 'gimloader';
// @ts-ignore
import styles from './styles.scss';
import { createUI } from "./ui";

GL.lib("DLDUtils").setLaserWarningEnabled(false);
GL.UI.addStyles(styles);

let startTasBtn = document.createElement("button");
startTasBtn.id = "startTasBtn";
startTasBtn.innerText = "Start TAS";

startTasBtn.addEventListener("click", () => startTasBtn.remove());

GL.onStop(() => startTasBtn.remove());

GL.net.onLoad(() => {
    document.body.appendChild(startTasBtn);
});

GL.parcel.getLazy(exports => exports?.PhysicsManager, exports => {
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
});

let moveSpeed = 310;

export function getMoveSpeed() {
    return moveSpeed;
}

export function setMoveSpeed(speed: number) {
    moveSpeed = speed;
}