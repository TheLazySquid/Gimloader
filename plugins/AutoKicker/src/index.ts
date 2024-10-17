/// <reference types="gimloader" />

// @ts-ignore
import styles from './styles.scss';
import AutoKicker from "./autokicker";
import UI from './ui';

let autoKicker = new AutoKicker();
let ui: HTMLElement | null = null;
let uiShown = true;

const checkStart = () => {
    if(GL.net.isHost) {
        autoKicker.start();

        ui = document.createElement("div");
        ui.id = "AutoKick-UI";
        GL.ReactDOM.createRoot(ui).render(GL.React.createElement(UI, { autoKicker }));
        document.body.appendChild(ui);
    }
}

GL.hotkeys.addConfigurable("AutoKicker", "toggleUI", () => {
    if(!ui) return;
    uiShown = !uiShown;
    if(uiShown) ui.style.display = "block";
    else ui.style.display = "none";
}, {
    category: "Auto Kicker",
    title: "Toggle UI",
    preventDefault: false,
    defaultKeys: new Set(["alt", "k"])
})

if(GL.net.type === "Colyseus") {
    if(GL.stores) checkStart();
    else GL.addEventListener("loadEnd", checkStart);
} else if(GL.net.type === "Blueboat") {
    checkStart();
} else {
    GL.addEventListener("loadEnd", checkStart);
}

GL.UI.addStyles("AutoKicker", styles);

export function onStop() {
    GL.UI.removeStyles("AutoKicker");
    autoKicker.dispose();
}