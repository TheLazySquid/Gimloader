/**
 * @name Savestates
 * @description Allows you to save and load states/summits in Don't Look Down. Only client side, nobody else can see you move.
 * @author TheLazySquid
 * @version 0.1.4
 * @reloadRequired true
 * @downloadUrl https://raw.githubusercontent.com/TheLazySquid/Gimloader/main/plugins/Savestates.js
 */

let ignoreServer = false;
if(!GL.pluginManager.isEnabled("DLDTAS")) {
    let hurtFrames = 0;
    let maxHurtFrames = 2;

    // disable the physics state from the server
    GL.parcel.interceptRequire("Savestates", exports => exports?.default?.toString?.().includes("[MOVEMENT]"), exports => {
        let ignoreTimeout;
        let lasers = [];

        const enableSavestates = () => {
            console.log("[Savestates] Enabled")
            ignoreServer = true;
            lasers = GL.stores.phaser.scene.worldManager.devices.allDevices.filter(d => d.laser);

            GL.notification.open({ message: "Savestates active", duration: 2 })

            // override the physics update to manually check for laser collisions
            let physics = GL.stores.phaser.scene.worldManager.physics;
            let showHitLaser = true;

            GL.patcher.after("Savestates", physics, "physicsStep", () => {
                if(!showHitLaser) return;
                let body = GL.stores.phaser.mainCharacter.physics.getBody();
                let translation = body.rigidBody.translation();
                let shape = body.collider.shape;

                let topLeft = {
                    x: (translation.x - shape.radius) * 100,
                    y: (translation.y - shape.halfHeight - shape.radius) * 100
                }
                let bottomRight = {
                    x: (translation.x + shape.radius) * 100,
                    y: (translation.y + shape.halfHeight + shape.radius) * 100
                }

                let states = GL.stores.world.devices.states;
                let hitLaser = false;

                for(let laser of lasers) {
                    // make sure the laser is active
                    if(!states.get(laser.id).properties.get("GLOBAL_active")) continue;

                    let start = {
                        x: laser.dots[0].options.x + laser.x,
                        y: laser.dots[0].options.y + laser.y
                    }
                    let end = {
                        x: laser.dots.at(-1).options.x + laser.x,
                        y: laser.dots.at(-1).options.y + laser.y
                    }

                    // check whether the player bounding box overlaps the laser line
                    if(boundingBoxOverlap(start, end, topLeft, bottomRight)) {
                        hitLaser = true;
                        break;
                    }
                }

                if(hitLaser) {
                    hurtFrames++;
                    if(hurtFrames >= maxHurtFrames) {
                        hurtFrames = 0;
                        showHitLaser = false;
                        GL.notification.error({ message: "You hit a laser!", duration: 3.5 })
                        setTimeout(() => showHitLaser = true, 500);
                    }
                } else hurtFrames = 0;
            })
        }
    
        // prevent colyseus from complaining that nothing is registered
        GL.patcher.instead("Savestates", exports, "default", (_, args) => {
            args[0].onMessage("PHYSICS_STATE", (packet) => {
                // teleports are allowed
                if(ignoreServer && !packet.teleport) return;
                moveCharToPos(packet.x / 100, packet.y / 100);

                if(!ignoreServer) {
                    if(ignoreTimeout) clearTimeout(ignoreTimeout);
                    ignoreTimeout = setTimeout(enableSavestates, 2500);
                }
            })
        })
    })
    
    function moveCharToPos(x, y) {
        let rb = GL.stores?.phaser?.mainCharacter?.physics?.getBody().rigidBody
        if(!rb) return;
    
        rb.setTranslation({ x, y }, true);
    }
}

// functions below AI generated there's no way I'm doing that myself
function boundingBoxOverlap(start, end, topLeft, bottomRight) {
    // check if the line intersects with any of the bounding box sides
    return lineIntersects(start, end, topLeft, { x: bottomRight.x, y: topLeft.y }) ||
        lineIntersects(start, end, topLeft, { x: topLeft.x, y: bottomRight.y }) ||
        lineIntersects(start, end, { x: bottomRight.x, y: topLeft.y }, bottomRight) ||
        lineIntersects(start, end, { x: topLeft.x, y: bottomRight.y }, bottomRight);
}

function lineIntersects(start1, end1, start2, end2) {
    let denominator = ((end1.x - start1.x) * (end2.y - start2.y)) - ((end1.y - start1.y) * (end2.x - start2.x));
    let numerator1 = ((start1.y - start2.y) * (end2.x - start2.x)) - ((start1.x - start2.x) * (end2.y - start2.y));
    let numerator2 = ((start1.y - start2.y) * (end1.x - start1.x)) - ((start1.x - start2.x) * (end1.y - start1.y));

    if(denominator == 0) return numerator1 == 0 && numerator2 == 0;

    let r = numerator1 / denominator;
    let s = numerator2 / denominator;

    return (r >= 0 && r <= 1) && (s >= 0 && s <= 1);
}

const summitCoords = [{
    "x": 38.25554275512695,
    "y": 638.3899536132812
}, {
    "x": 90.22997283935547,
    "y": 638.377685546875
}, {
    "x": 285.44000244140625,
    "y": 532.780029296875
}, {
    "x": 217.5500030517578,
    "y": 500.7799987792969
}, {
    "x": 400.3399963378906,
    "y": 413.739990234375
}, {
    "x": 356.5400085449219,
    "y": 351.6600036621094
}, {
    "x": 401.2699890136719,
    "y": 285.739990234375
}]

const defaultState =  '{"gravity":0.001,"velocity":{"x":0,"y":0},"movement":{"direction":"none","xVelocity":0,"accelerationTicks":0},"jump":{"isJumping":false,"jumpsLeft":2,"jumpCounter":0,"jumpTicks":118,"xVelocityAtJumpStart":0},"forces":[],"grounded":true,"groundedTicks":0,"lastGroundedAngle":0}'

let hotkeyEquivs = [')', '!', '@', '#', '$', '%', '^'];
let summitHotkeys = [];
for(let i = 0; i <= 6; i++) {
    // shift + alt + 0-6
    summitHotkeys.push(new Set(['shift', 'alt', hotkeyEquivs[i]]));
}

let saveStateHotkey = new Set(['alt', ',']);
let loadStateHotkey = new Set(['alt', '.']);

GL.addEventListener("loadEnd", () => {
    // add hotkeys for summits
    for(let i = 0; i < summitHotkeys.length; i++) {
        let hotkey = summitHotkeys[i];
        
        GL.hotkeys.add(hotkey, () => {
            ignoreServer = true;

            let physics = GL.stores.phaser.mainCharacter.physics;
            let rb = physics.getBody().rigidBody;

            rb.setTranslation(summitCoords[i], true);

            physics.state = JSON.parse(defaultState);
        })
    }

    let lastPos, lastState;

    // saving
    GL.hotkeys.add(saveStateHotkey, () => {
        let physics = GL.stores.phaser.mainCharacter.physics;
        let rb = physics.getBody().rigidBody;

        lastPos = rb.translation();
        lastState = JSON.stringify(physics.state);

        GL.notification.open({ message: "State Saved", duration: 0.75 })
    })

    // loading
    GL.hotkeys.add(loadStateHotkey, () => {
        let physics = GL.stores.phaser.mainCharacter.physics;
        let rb = physics.getBody().rigidBody;

        if(!lastPos || !lastState) return;

        rb.setTranslation(lastPos, true);
        physics.state = JSON.parse(lastState);

        GL.notification.open({ message: "State Loaded", duration: 0.75 })
    })
})

export function onStop() {
    for(let hotkey of summitHotkeys) {
        GL.hotkeys.remove(hotkey);
    }

    GL.hotkeys.remove(saveStateHotkey, loadStateHotkey);
    GL.patcher.unpatchAll("Savestates");
    GL.parcel.stopIntercepts("Savestates");
}