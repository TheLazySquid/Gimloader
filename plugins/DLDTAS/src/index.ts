/// <reference types="gimloader" />

// @ts-ignore
import styles from './styles.scss';
import { createUI } from "./ui";

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

// disable the physics state from the server
GL.parcel.interceptRequire("TAS", exports => exports?.default?.toString?.().includes("[MOVEMENT]"), exports => {
    let ignoreServer = false;
    startTasBtn.addEventListener("click", () => {
        ignoreServer = true;
    })

    // prevent colyseus from complaining that nothing is registered
    GL.patcher.instead("TAS", exports, "default", (_, args: IArguments) => {
        args[0].onMessage("PHYSICS_STATE", (packet: any) => {
            if(ignoreServer) return;
            moveCharToPos(packet.x / 100, packet.y / 100);
        })
    })
})

function moveCharToPos(x: number, y: number) {
    let rb = GL.stores?.phaser?.mainCharacter?.physics?.getBody().rigidBody
    if(!rb) return;

    rb.setTranslation({ x, y }, true);
}

export function onStop() {
    GL.UI.removeStyles("TAS")
    GL.parcel.stopIntercepts("TAS")
    GL.patcher.unpatchAll("TAS")
}