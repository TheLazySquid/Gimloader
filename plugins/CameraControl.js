/**
 * @name CameraControl
 * @description Lets you freely move and zoom your camera
 * @author TheLazySquid
 * @version 0.1.0
 * @downloadUrl https://raw.githubusercontent.com/TheLazySquid/Gimloader/main/plugins/CameraControl.js
 */

const freecamHotkey = new Set(["shift", "f"]);

window.addEventListener("wheel", onWheel);

let freecamming = false;
let freecamPos = {x: 0, y: 0};
let freecamInterval = null;

let stopProps = [new Set(["arrowleft"]), new Set(["arrowright"]), new Set(["arrowup"]), new Set(["arrowdown"])]

GL.hotkeys.add(freecamHotkey, () => {
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
            let moveAmount = 28 / camera.zoom;
            let pressed = GL.hotkeys.pressedKeys;

            if(pressed.has("arrowleft")) freecamPos.x -= moveAmount;
            if(pressed.has("arrowright")) freecamPos.x += moveAmount;
            if(pressed.has("arrowup")) freecamPos.y -= moveAmount;
            if(pressed.has("arrowdown")) freecamPos.y += moveAmount;

            scene.cameraHelper.goTo(freecamPos);
        }, 1000 / 30);
    }

    freecamming = !freecamming;
}, true)

function onWheel(e) {
    let camera = GL.stores?.phaser?.scene?.cameras?.cameras?.[0];
    if(!camera) return;

    camera.zoom *= 1 + e.deltaY / 1000;
}


export function onStop() {
    window.removeEventListener("wheel", onWheel);
    GL.hotkeys.remove(freecamHotkey);
}