/// <reference types="gimloader" />

// @ts-ignore
import styles from './styles.scss';
import AutoKicker from "./autokicker";

let autoKicker = new AutoKicker();

const checkStart = () => {
    if(GL.net.isHost) {
        autoKicker.start();
    }
}

if(GL.net.type === "Colyseus") {
    if(GL.stores) checkStart();
    else GL.addEventListener("loadEnd", checkStart)
} else if(GL.net.type === "Blueboat") {
    checkStart();
} else {
    GL.addEventListener("loadEnd", checkStart)
}

GL.UI.addStyles("AutoKicker", styles);

export function onStop() {
    GL.UI.removeStyles("AutoKicker");
    autoKicker.dispose();
}