/// <reference types="gimloader" />
import UI from './ui';
// @ts-ignore
import styles from './styles.scss';
import CosmeticChanger from './cosmeticChanger';

let hotkey = new Set(['alt', 'c']);
let cosmeticChanger = new CosmeticChanger();

GL.UI.addStyles("CharacterCustomization", styles);
GL.hotkeys.add(hotkey, () => {
    let submitCallback: () => void;

    GL.UI.showModal(GL.React.createElement(UI, {
        cosmeticChanger,
        onSubmit: (callback) => {
            submitCallback = callback;
        }
    }), {
        title: "Character Customization",
        closeOnBackgroundClick: true,
        buttons: [
            {
                text: "Cancel",
                style: "close"
            },
            {
                text: "Apply",
                style: "primary",
                onClick: () => {
                    submitCallback();
                }
            }
        ]
    });
})


export function onStop() {
    cosmeticChanger.reset();

    GL.hotkeys.remove(hotkey);
    GL.UI.removeStyles("CharacterCustomization");
    GL.parcel.stopIntercepts("CharacterCustomization");
}