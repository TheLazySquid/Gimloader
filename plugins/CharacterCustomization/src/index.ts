/// <reference types="gimloader" />
// @ts-ignore
import UI from './UI.svelte';
import CosmeticChanger from './cosmeticChanger';

let hotkey = new Set(['alt', 'c']);
let cosmeticChanger = new CosmeticChanger();

function showUI() {
    let div = document.createElement("div");
    // @ts-ignore
    let ui = new UI({
        target: div,
        props: {
            cosmeticChanger
        }
    });

    GL.UI.showModal(div, {
        id: "CharacterCustomization",
        title: "Character Customization",
        closeOnBackgroundClick: false,
        style: "min-width: min(90vw, 500px)",
        onClosed() {
            // @ts-ignore
            ui.$destroy();
        },
        buttons: [
            {
                text: "Cancel",
                style: "close"
            },
            {
                text: "Apply",
                style: "primary",
                onClick() {
                    ui.save();
                }
            }
        ]
    });
}

GL.hotkeys.add(hotkey, showUI);

export function openSettingsMenu() {
    showUI();
}

export function onStop() {
    cosmeticChanger.reset();

    GL.hotkeys.remove(hotkey);
    GL.parcel.stopIntercepts("CharacterCustomization");
    GL.patcher.unpatchAll("CharacterCustomization");
}