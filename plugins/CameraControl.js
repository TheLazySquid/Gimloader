/**
 * @name CameraControl
 * @description Lets you freely move and zoom your camera
 * @author TheLazySquid & Blackhole927
 * @version 0.4.0
 * @downloadUrl https://raw.githubusercontent.com/TheLazySquid/Gimloader/main/plugins/CameraControl.js
 * @needsLib QuickSettings | https://raw.githubusercontent.com/TheLazySquid/Gimloader/refs/heads/main/libraries/QuickSettings/build/QuickSettings.js
 * @optionalLib CommandLine | https://raw.githubusercontent.com/Blackhole927/gimkitmods/main/libraries/CommandLine/CommandLine.js
 * @hasSettings true
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
        type: "boolean",
        id: "mouseControls",
        title: "Use mouse controls while freecamming",
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

let freecamming = false;
let freecamPos = {x: 0, y: 0};
let scrollMomentum = 0;
let changedZoom = false;

let stopProps = [new Set(["arrowleft"]), new Set(["arrowright"]), new Set(["arrowup"]), new Set(["arrowdown"])];

let updateFreecam = null;
let updateScroll = (dt) => {
    let camera = GL.stores?.phaser?.scene?.cameras?.cameras?.[0];
    if(!camera) return;
    
    scrollMomentum *= Math.pow(.97, dt);
    camera.zoom += scrollMomentum * dt;
    if(scrollMomentum > 0) changedZoom = true;

    if(settings.capZoomOut) {
        if(camera.zoom <= 0.1) {
            scrollMomentum = 0;
        }
    
        camera.zoom = Math.max(0.1, camera.zoom);
    }
}

const patchFrame = () => {
    if(GL.net.type !== "Colyseus") return;
    let worldManager = GL.stores.phaser.scene.worldManager;

    // whenever a frame passes
    GL.patcher.after("CameraControl", worldManager, "update", (_, args) => {
        updateFreecam?.(args[0]);
        updateScroll(args[0]);
    });
}

if(GL.net.type === "Colyseus") patchFrame()
GL.addEventListener("loadEnd", patchFrame);

let scene, camera;

const getCanvasZoom = () => {
    let transform = GL.stores.phaser.scene.game.canvas.style.transform;
    if(!transform) return 1;
    return parseFloat(transform.split("(")[1].replace(")", ""));
}

let isPointerDown = false;
const setPointerDown = () => isPointerDown = true;
const setPointerUp = () => isPointerDown = false;
window.addEventListener('pointerdown', setPointerDown);
window.addEventListener('pointerup', setPointerUp);

let lastX, lastY;
function onPointermove(e) {
    let canvasZoom = getCanvasZoom();
    
    if (isPointerDown && lastX && lastY) {
        freecamPos.x -= ((e.clientX / canvasZoom) - lastX) / camera.zoom;
        freecamPos.y -= ((e.clientY / canvasZoom) - lastY) / camera.zoom;
    }
    
    lastX = e.clientX / canvasZoom;
    lastY = e.clientY / canvasZoom;
}

function onWheel(e) {
    if(!freecamming || !settings.mouseControls) {
        if(settings.shiftToZoom && !GL.hotkeys.pressedKeys.has("shift")) return;
        scrollMomentum -= e.deltaY / 65000;
        return;
    }

    if(camera.zoom == 0.1 && e.deltaY > 0 && settings.capZoomOut) return;

    var oldzoom = camera.zoom;
    var newzoom = oldzoom * (e.deltaY < 0 ? 1.1 : 0.9);

    let canvasZoom = getCanvasZoom();
    var mouse_x = e.clientX / canvasZoom;
    var mouse_y = e.clientY / canvasZoom;

    var pixels_difference_w = (camera.width / oldzoom) - (camera.width / newzoom);
    var side_ratio_x = (mouse_x - (camera.width / 2)) / camera.width;
    freecamPos.x += pixels_difference_w * side_ratio_x;

    var pixels_difference_h = (camera.height / oldzoom) - (camera.height / newzoom);
    var side_ratio_h = (mouse_y - (camera.height / 2)) / camera.height;
    freecamPos.y += pixels_difference_h * side_ratio_h;

    camera.setZoom(newzoom);
    changedZoom = true;
}

GL.addEventListener("loadEnd", () => {
    scene = GL.stores?.phaser?.scene;
    camera = scene?.cameras?.cameras?.[0];
    if(!scene) return;
    
    // disable the camera zoom being reset when changing the screen size
    GL.patcher.before("CameraControl", GL.stores.phaser.scene.cameraHelper, "resize", () => {
        return changedZoom;
    });

    window.addEventListener("wheel", onWheel);
});

let disableAim = false;

function stopFreecamming() {
    if(!scene || !camera) return;
    disableAim = false;

    camera.useBounds = true;
    let charObj = scene.characterManager.characters
        .get(GL.stores.phaser.mainCharacter.id).body

    scene.cameraHelper.startFollowingObject({ object: charObj })
    updateFreecam = null;

    for(let key of stopProps) {
        GL.hotkeys.remove(key);
    }

    window.removeEventListener('pointermove', onPointermove);
}

GL.parcel.interceptRequire("CameraControl", (exports) => exports?.AmIAiming, (exports) => {
    GL.patcher.before("CameraControl", exports, "AmIAiming", () => {
        if(disableAim) return true;
    })
});

GL.hotkeys.addConfigurable("CameraControl", "freecam", () => {
    if(!scene || !camera) return;
    
    if(freecamming) {
        // stop freecamming
        stopFreecamming();
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

        // show the cursor
        disableAim = true;
        GL.stores.phaser.scene.game.canvas.style.cursor = "default";

        window.addEventListener('pointermove', onPointermove);
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
    GL.hotkeys.removeConfigurable("CameraControl", "freecam");
    GL.hotkeys.removeConfigurable("CameraControl", "zoomToggle");
    GL.patcher.unpatchAll("CameraControl");
    GL.parcel.stopIntercepts("CameraControl");

    if(commandLine) {
        commandLine.removeCommand("setzoom");
    }

    window.removeEventListener('wheel', onWheel);
    window.removeEventListener('mousedown', setPointerDown);
    window.removeEventListener('mouseup', setPointerUp);

    // stop freecamming
    if(freecamming) {
        stopFreecamming();
    }
}

export const openSettingsMenu = settings.openSettingsMenu;