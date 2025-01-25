import GL from 'gimloader';
// @ts-ignore
import UI from './ui/Start.svelte';

let ui: UI;
GL.net.onLoad(() => {
    // @ts-ignore vscode's going wacky
    ui = new UI({
        target: document.body
    });

    GL.onStop(() => ui.$destroy());
});