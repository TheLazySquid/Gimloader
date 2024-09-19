/**
 * @name CameraControl
 * @description Lets you freely move and zoom your camera
 * @author TheLazySquid & Blackhole927
 * @version 0.2.4
 * @downloadUrl https://raw.githubusercontent.com/TheLazySquid/Gimloader/main/plugins/CameraControl.js
 * @needsLib QuickSettings | https://raw.githubusercontent.com/TheLazySquid/Gimloader/refs/heads/main/libraries/QuickSettings/build/QuickSettings.js
 * @optionalLib CommandLine | https://raw.githubusercontent.com/Blackhole927/gimkitmods/main/libraries/CommandLine/CommandLine.js
 */

let settings = GL.lib("QuickSettings")("CameraControl", [
    {
        type: "heading",
        text: "CameraControl Settings"
    },
    {
        type: "boolean",
        id: "shiftToZoom",
        title: "Hold Shift to Zoom",
        default: true
    }, {
        type: "number",
        id: "toggleZoomFactor",
        title: "Toggle Zoom Factor",
        min: 0.05,
        max: 20,
        default: 2
    }
]);

window.addEventListener("wheel", onWheel);

let freecamming = false;
let freecamPos = {x: 0, y: 0};
let freecamMomentum = {x: 0, y: 0};
let scrollMomentum = 0;
let freecamInterval = null;
let scrollInterval = null;

let stopProps = [new Set(["arrowleft"]), new Set(["arrowright"]), new Set(["arrowup"]), new Set(["arrowdown"])];

GL.hotkeys.addConfigurable("CameraControl", "freecam", () => {
    let scene = GL.stores?.phaser?.scene;
    let camera = scene?.cameras?.cameras?.[0];
    if(!scene || !camera) return;
    
    if(freecamming) {
        // stop freecamming
        camera.useBounds = true;
        let charObj = scene.characterManager.characters
            .get(GL.stores.phaser.mainCharacter.id).body

        scene.cameraHelper.startFollowingObject({ object: charObj })
        if(freecamInterval) clearInterval(freecamInterval);

        for(let key of stopProps) {
            GL.hotkeys.remove(key);
        }
    } else {
        // start freecamming
        scene.cameraHelper.stopFollow();
        camera.useBounds = false;
        freecamPos = {x: camera.midPoint.x, y: camera.midPoint.y};

        for(let key of stopProps) {
            GL.hotkeys.add(key, (e) => {
                e.stopImmediatePropagation();
            }, true)
        }

        // move the camera
        freecamInterval = setInterval(() => {
            let moveAmount = 5 / camera.zoom;
            let pressed = GL.hotkeys.pressedKeys;

            if(pressed.has("arrowleft")) freecamMomentum.x -= moveAmount;
            if(pressed.has("arrowright")) freecamMomentum.x += moveAmount;
            if(pressed.has("arrowup")) freecamMomentum.y -= moveAmount;
            if(pressed.has("arrowdown")) freecamMomentum.y += moveAmount;

            freecamPos.x += freecamMomentum.x;
            freecamPos.y += freecamMomentum.y;
            freecamMomentum.x *= 0.75;
            freecamMomentum.y *= 0.75;

            scene.cameraHelper.goTo(freecamPos);
        }, 1000 / 30);
    }

    freecamming = !freecamming;
}, {
    category: "Camera Control",
    title: "Enable Freecam",
    stopPropagation: false,
    defaultKeys: new Set(["shift", "f"])
})

scrollInterval = setInterval(() => {
    let camera = GL.stores?.phaser?.scene?.cameras?.cameras?.[0];
    if(!camera) return;

    scrollMomentum *= 0.7;
    if (camera.zoom >= 0.1) {
        camera.zoom += scrollMomentum;
    } else {
        scrollMomentum = 0;
        camera.zoom = 0.1;
    }
}, 1000 / 30);

// optional command line integration
let commandLine = GL.lib("CommandLine");
if(commandLine) {
    commandLine.addCommand("setzoom", [
        {"amount": "number"}
    ], (zoom) => {
        let scene = GL.stores?.phaser?.scene;
        let camera = scene?.cameras?.cameras?.[0];
        if(!scene || !camera) return;

        camera.zoom = parseFloat(zoom);
    })
}

function onWheel(e) {
    if(settings.shiftToZoom && !e.shiftKey) return;

    scrollMomentum += e.deltaY / 5000;
}

let zoomToggled = false;
let initialZoom = 1;
const onDown = () => {
    if(!settings.toggleZoomFactor) return;
    
    let scene = GL.stores?.phaser?.scene;
    let camera = scene?.cameras?.cameras?.[0];
    if(!scene || !camera) return;

    if(zoomToggled) {
        camera.zoom = initialZoom;
    } else {
        initialZoom = camera.zoom;
        camera.zoom /= settings.toggleZoomFactor;
    }

    zoomToggled = !zoomToggled;
}

GL.hotkeys.addConfigurable("CameraControl", "zoomToggle", onDown, {
    category: "Camera Control",
    title: "Quick Zoom Toggle",
    stopPropagation: false
});

export function onStop() {
    window.removeEventListener("wheel", onWheel);
    GL.hotkeys.removeConfigurable("CameraControl", "freecam");
    GL.hotkeys.removeConfigurable("CameraControl", "zoomToggle");

    clearInterval(freecamInterval);
    clearInterval(scrollInterval);

    if(commandLine) {
        commandLine.removeCommand("setzoom");
    }

    // stop freecamming
    if(freecamming) {
        let scene = GL.stores?.phaser?.scene;
        let camera = scene?.cameras?.cameras?.[0];
        if(!scene || !camera) return;

        camera.useBounds = true;
        let charObj = scene.characterManager.characters
            .get(GL.stores.phaser.mainCharacter.id).body

        scene.cameraHelper.startFollowingObject({ object: charObj })
        if(freecamInterval) clearInterval(freecamInterval);

        for(let key of stopProps) {
            GL.hotkeys.remove(key);
        }
    }
}

export const openSettingsMenu = settings.openSettingsMenu;