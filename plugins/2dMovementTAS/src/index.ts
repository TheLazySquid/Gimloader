// @ts-ignore
import UI from './ui/Start.svelte';

let ui: UI;
GL.addEventListener("loadEnd", () => {
    // @ts-ignore vscode's going wacky
    ui = new UI({
        target: document.body
    });
});

export function onStop() {
    // @ts-ignore vscode, again
    ui?.$destroy();
    GL.patcher.unpatchAll("2dMovementTAS");
    GL.parcel.stopIntercepts("2dMovementTAS");
}