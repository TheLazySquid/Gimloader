import GL from 'gimloader';
// @ts-ignore
import styles from './styles.scss';
import AutoKicker from "./autokicker";
import UI from './ui';

let autoKicker = new AutoKicker();
let ui: HTMLElement | null = null;
let uiShown = GL.storage.getValue("uiShown", true);

const checkStart = () => {
    if(GL.net.isHost) {
        autoKicker.start();

        ui = document.createElement("div");
        ui.id = "AutoKick-UI";
        GL.ReactDOM.createRoot(ui).render(GL.React.createElement(UI, { autoKicker }));
        document.body.appendChild(ui);

        if(!uiShown) {
            ui.style.display = "none";
            if(autoKicker.kickDuplicateNames || autoKicker.kickSkinless ||
                autoKicker.blacklist.length > 0 || autoKicker.kickIdle) {
                GL.notification.open({ message: "AutoKicker is running!" });
            }
        }
    }
}

GL.hotkeys.addConfigurableHotkey({
    category: "Auto Kicker",
    title: "Toggle UI",
    preventDefault: false,
    default: {
        key: "KeyK",
        alt: true
    }
}, () => {
    if(!ui) return;
    uiShown = !uiShown;
    if(uiShown) ui.style.display = "block";
    else ui.style.display = "none";
    GL.storage.setValue("uiShown", uiShown);
})

GL.net.onLoad(checkStart);
GL.UI.addStyles(styles);