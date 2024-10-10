/**
 * @name CameraControl
 * @description Lets you freely move and zoom your camera
 * @author TheLazySquid & Blackhole927
 * @version 0.3.1
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
    }, {
        type: "boolean",
        id: "capZoomOut",
        title: "Cap Zoom Out",
        default: true
    }
]);

window.addEventListener("wheel", onWheel);

let freecamming = false;
let freecamPos = {x: 0, y: 0};
let scrollMomentum = 0;

let stopProps = [new Set(["arrowleft"]), new Set(["arrowright"]), new Set(["arrowup"]), new Set(["arrowdown"])];

let updateFreecam = null;
let updateScroll = (dt) => {
    let camera = GL.stores?.phaser?.scene?.cameras?.cameras?.[0];
    if(!camera) return;
    
    scrollMomentum *= Math.pow(.97, dt);
    camera.zoom += scrollMomentum * dt;

    if(settings.capZoomOut) {
        if(camera.zoom <= 0.1) {
            scrollMomentum = 0;
        }
    
        camera.zoom = Math.max(0.1, camera.zoom);
    }
}

const patchFrame = () => {
    if(GL.net.type !== "Colyseus") return;
    let worldManager = GL.stores.phaser.scene.worldManager

    // whenever a frame passes
    GL.patcher.after("CameraControl", worldManager, "update", (_, args) => {
        updateFreecam?.(args[0]);
        updateScroll(args[0]);
    });
}

if(GL.net.type === "Colyseus") patchFrame()
GL.addEventListener("loadEnd", patchFrame);

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
        updateFreecam = null;

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
        updateFreecam = (dt) => {
            let moveAmount = 0.8 / camera.zoom * dt;
            let pressed = GL.hotkeys.pressedKeys;
            if(pressed.has("control")) moveAmount *= 5;

            if(pressed.has("arrowleft")) freecamPos.x -= moveAmount;
            if(pressed.has("arrowright")) freecamPos.x += moveAmount;
            if(pressed.has("arrowup")) freecamPos.y -= moveAmount;
            if(pressed.has("arrowdown")) freecamPos.y += moveAmount;

            scene.cameraHelper.goTo(freecamPos);
        };
    }

    freecamming = !freecamming;
}, {
    category: "Camera Control",
    title: "Enable Freecam",
    stopPropagation: false,
    defaultKeys: new Set(["shift", "f"])
})

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

    scrollMomentum += e.deltaY / 65000;
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
    GL.patcher.unpatchAll("CameraControl");

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

        for(let key of stopProps) {
            GL.hotkeys.remove(key);
        }
    }
}

export const openSettingsMenu = settings.openSettingsMenu;