import GL from 'gimloader';
import { ISharedValues } from "../types";

let lasers: any[] = [];
let laserOffset: number = GL.storage.getValue("laserOffset", 0);

GL.net.on("DEVICES_STATES_CHANGES", (packet: any) => {
    for(let i = 0; i < packet.changes.length; i++) {
        let device = packet.changes[i];
        if(lasers.some(l => l.id === device[0])) {
            packet.changes.splice(i, 1)
            i -= 1;
        }
    }
})

export function initLasers(values: ISharedValues) {
    GL.hotkeys.addHotkey({
        key: "KeyL",
        alt: true
    }, () => {
        GL.hotkeys.releaseAll();

        let offset = prompt(`Enter the laser offset in frames, from 0 to 65 (currently ${laserOffset})`)
        if(offset === null) return;

        let parsed = parseInt(offset);

        if(isNaN(parsed) || parsed < 0 || parsed > 65) {
            alert("Invalid offset")
            return;
        }

        setLaserOffset(parsed);
        updateLasers(values.currentFrame);
    });
}

export function getLaserOffset() {
    return laserOffset;
}

export function setLaserOffset(offset: number) {
    laserOffset = offset;
    GL.storage.getValue("laserOffset", offset);
}

export function updateLasers(frame: number) {
    if(lasers.length === 0) {
        lasers = GL.stores.phaser.scene.worldManager.devices.allDevices.filter((d: any) => d.laser)
    }

    // lasers turn on for 36 frames and off for 30 frames
    let states = GL.stores.world.devices.states
    let devices = GL.stores.phaser.scene.worldManager.devices
    let active = (frame + laserOffset) % 66 < 36;

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
}