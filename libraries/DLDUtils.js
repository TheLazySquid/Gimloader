/**
 * @name DLDUtils
 * @description Allows plugins to move characters without the server's permission
 * @author TheLazySquid
 * @version 0.2.4
 * @downloadUrl https://raw.githubusercontent.com/TheLazySquid/Gimloader/main/libraries/DLDUtils.js
 * @isLibrary true
 */

const respawnHeight = 621.093;
const floorHeight = 638.37;
let lastCheckpointReached = 0;
let canRespawn = false;

GL.addEventListener("loadEnd", () => {
    GL.net.colyseus.room.state.session.gameSession.listen("phase", (phase) => {
        if(phase === "results") {
            canRespawn = false;
            lastCheckpointReached = 0;
        }
    })
})

export function cancelRespawn() {
    canRespawn = false;
}

const checkpointCoords = [{
    x: 38.25554275512695,
    y: 638.3899536132812
}, {
    x: 90.22997283935547,
    y: 638.377685546875
}, {
    x: 285.44000244140625,
    y: 532.780029296875
}, {
    x: 217.5500030517578,
    y: 500.7799987792969
}, {
    x: 400.3399963378906,
    y: 413.739990234375
}, {
    x: 356.5400085449219,
    y: 351.6600036621094
}, {
    x: 401.2699890136719,
    y: 285.739990234375
}]

let showLaserWarning = true;

export function setLaserWarningEnabled(enabled) {
    showLaserWarning = enabled;
}

const enable = () => {
    let hurtFrames = 0;
    let maxHurtFrames = 1;
    
    // disable the physics state from the server
    let lasers = GL.stores.phaser.scene.worldManager.devices.allDevices.filter(d => d.laser);
    let states = GL.stores.world.devices.states;
    let body = GL.stores.phaser.mainCharacter.physics.getBody();
    let shape = body.collider.shape;
    
    // override the physics update to manually check for laser collisions
    let physics = GL.stores.phaser.scene.worldManager.physics;
    let showHitLaser = true;
    GL.patcher.before("DLDUtils", physics, "physicsStep", () => {
        // Ignore running out of energy
        if(GL.stores.me.movementSpeed === 0) GL.stores.me.movementSpeed = 310;
    });

    let wasOnLastFrame = false;
    let startImmunityActive = false;

    GL.patcher.after("DLDUtils", physics, "physicsStep", () => {
        if(GL.net.colyseus.room.state.session.gameSession.phase === "results") return;
        if(!showHitLaser || !showLaserWarning || startImmunityActive) return;

        // all the lasers always have the same state
        let lasersOn = states.get(lasers[0].id).properties.get("GLOBAL_active");

        // some leniency between lasers turning on and doing damage
        if(!wasOnLastFrame && lasersOn) {
            startImmunityActive = true;
            setTimeout(() => startImmunityActive = false, 360);
        }
        wasOnLastFrame = lasersOn;
        if(!lasersOn || startImmunityActive) return;

        let translation = body.rigidBody.translation();
    
        // calculate the bounding box of the player
        let topLeft = {
            x: (translation.x - shape.radius) * 100,
            y: (translation.y - shape.halfHeight - shape.radius) * 100
        }
        let bottomRight = {
            x: (translation.x + shape.radius) * 100,
            y: (translation.y + shape.halfHeight + shape.radius) * 100
        }
    
        let hitLaser = false;
    
        // check collision with lasers
        for(let laser of lasers) {
            // make sure the laser is active
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

        // check if we've reached a checkpoint
        for(let i = lastCheckpointReached + 1; i < checkpointCoords.length; i++) {
            let checkpoint = checkpointCoords[i];
            if(boundingBoxOverlap(topLeft, bottomRight, {
                x: checkpoint.x * 100,
                y: checkpoint.y * 100 + 100
            }, {
                x: checkpoint.x * 100 + 100,
                y: checkpoint.y * 100
            })) {
                console.log("Reached Checkpoint", i);
                lastCheckpointReached = i;
                break;
            }
        }

        // check for respawning
        if(translation.y < respawnHeight) {
            canRespawn = true;
        }

        if(canRespawn && translation.y > floorHeight) {
            canRespawn = false;
            setTimeout(() => {
                moveCharToPos(checkpointCoords[lastCheckpointReached].x, checkpointCoords[lastCheckpointReached].y);
                GL.stores.me.isRespawning = true;
                setTimeout(() => GL.stores.me.isRespawning = false, 1000);
            }, 300);
        }
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

// obviously not perfect, but I can't think of a good way to check;
function isDLD() {
    let tileManager = GL.stores.phaser.scene.tileManager;
    let layer = tileManager.layerManager.layers.get("terrain-3");

    // confirm that this is DLD
    return layer.tiles.size === 1955;
}

GL.addEventListener("loadEnd", () => {
    if(!isDLD()) return;

    enable();
});

GL.parcel.interceptRequire("DLDUtils", exports => exports?.default?.toString?.().includes("[MOVEMENT]"), exports => {  
    // prevent colyseus from complaining that nothing is registered
    GL.patcher.instead("DLDUtils", exports, "default", (_, args) => {
        args[0].onMessage("PHYSICS_STATE", (packet) => {
            if(isDLD()) return;
            
            let mc = GL.stores.phaser.mainCharacter;
            mc?.physics.setServerPosition({
                packet: packet.packetId,
                x: packet.x,
                y: packet.y,
                jsonState: JSON.parse(packet.physicsState || "{}"),
                teleport: packet.teleport
            })
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