let lasers: any[] = [];

GL.net.colyseus.addEventListener("DEVICES_STATES_CHANGES", (packet: any) => {
    for(let i = 0; i < packet.detail.changes.length; i++) {
        let device = packet.detail.changes[i];
        if(lasers.some(l => l.id === device[0])) {
            packet.detail.changes.splice(i, 1)
            i -= 1;
        }
    }
})

let hurtFrames = 0;
let maxHurtFrames = 2;
let showHitLaser = true;

export function updateLasers(frame: number) {
    if(lasers.length === 0) {
        lasers = GL.stores.phaser.scene.worldManager.devices.allDevices.filter((d: any) => d.laser)
    }

    // lasers turn on for 36 frames and off for 30 frames
    let states = GL.stores.world.devices.states
    let devices = GL.stores.phaser.scene.worldManager.devices
    let active = frame % 66 < 36;

    if(!states.has(lasers[0].id)) {
        lasers = GL.stores.phaser.scene.worldManager.devices.allDevices.filter((d: any) => d.laser)
    }

    for(let laser of lasers) {
        if(!states.has(laser.id)) {
            let propsMap = new Map();
            propsMap.set("GLOBAL_active", active)
            states.set(laser.id, { properties: propsMap })
        } else {
            states.get(laser.id).properties.set("GLOBAL_active", active)
        }
        devices.getDeviceById(laser.id).onStateUpdateFromServer("GLOBAL_active", active)
    }
    
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
}

interface ICoordinate { x: number, y: number };

// functions below AI generated there's no way I'm doing that myself
function boundingBoxOverlap(start: ICoordinate, end: ICoordinate, topLeft: ICoordinate, bottomRight: ICoordinate) {
    // check if the line intersects with any of the bounding box sides
    return lineIntersects(start, end, topLeft, { x: bottomRight.x, y: topLeft.y }) ||
        lineIntersects(start, end, topLeft, { x: topLeft.x, y: bottomRight.y }) ||
        lineIntersects(start, end, { x: bottomRight.x, y: topLeft.y }, bottomRight) ||
        lineIntersects(start, end, { x: topLeft.x, y: bottomRight.y }, bottomRight);
}

function lineIntersects(start1: ICoordinate, end1: ICoordinate, start2: ICoordinate, end2: ICoordinate) {
    let denominator = ((end1.x - start1.x) * (end2.y - start2.y)) - ((end1.y - start1.y) * (end2.x - start2.x));
    let numerator1 = ((start1.y - start2.y) * (end2.x - start2.x)) - ((start1.x - start2.x) * (end2.y - start2.y));
    let numerator2 = ((start1.y - start2.y) * (end1.x - start1.x)) - ((start1.x - start2.x) * (end1.y - start1.y));

    if(denominator == 0) return numerator1 == 0 && numerator2 == 0;

    let r = numerator1 / denominator;
    let s = numerator2 / denominator;

    return (r >= 0 && r <= 1) && (s >= 0 && s <= 1);
}