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

export function stopUpdatingLasers() {
    lasers = [];
}

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
}