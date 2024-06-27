/**
 * @name DLDUtils
 * @description Allows plugins to move characters without the server's permission
 * @author TheLazySquid
 * @version 0.1.1
 * @downloadUrl https://raw.githubusercontent.com/TheLazySquid/Gimloader/main/libraries/DLDUtils.js
 * @isLibrary true
 */

let showLaserWarning = true;

export function setLaserWarningEnabled(enabled) {
    showLaserWarning = enabled;
}

const enable = () => {
    let hurtFrames = 0;
    let maxHurtFrames = 1;
    
    // disable the physics state from the server
    let lasers = GL.stores.phaser.scene.worldManager.devices.allDevices.filter(d => d.laser);
    
    // override the physics update to manually check for laser collisions
    let physics = GL.stores.phaser.scene.worldManager.physics;
    let showHitLaser = true;
    GL.patcher.after("DLDUtils", physics, "physicsStep", () => {
        if(!showHitLaser || !showLaserWarning) return;
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
            if(laser.dots.length <= 1) continue;

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

    // move the player to the initial position
    let rb = GL.stores.phaser.mainCharacter.physics.getBody().rigidBody;
    rb.setTranslation({
        "x": 33.87,
        "y": 638.38
    }, true);

    // make the physics deterministic
    for(let id of physics.bodies.staticBodies) {
        physics.bodies.activeBodies.enableBody(id)
    }
    
    // ignore attempts to disable bodies
    physics.bodies.activeBodies.disableBody = () => {};
}

GL.addEventListener("loadEnd", enable);

GL.parcel.interceptRequire("DLDUtils", exports => exports?.default?.toString?.().includes("[MOVEMENT]"), exports => {  
    // prevent colyseus from complaining that nothing is registered
    GL.patcher.instead("DLDUtils", exports, "default", (_, args) => {
        args[0].onMessage("PHYSICS_STATE", (packet) => {
            // teleports are allowed
            if(!packet.teleport) return;
            moveCharToPos(packet.x / 100, packet.y / 100);
        })
    })
})

export function moveCharToPos(x, y) {
    let rb = GL.stores?.phaser?.mainCharacter?.physics?.getBody().rigidBody
    if(!rb) return;

    rb.setTranslation({ x, y }, true);
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

export function onStop() {
    GL.parcel.stopIntercepts("DLDUtils");
    GL.patcher.unpatchAll("DLDUtils");
}