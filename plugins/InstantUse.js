/**
 * @name InstantUse
 * @description Instantly use nearby devices without any wait
 * @author TheLazySquid
 * @version 0.1.1
 * @downloadUrl https://raw.githubusercontent.com/TheLazySquid/Gimloader/main/plugins/InstantUse.js
 */

let hotkey = new Set(['enter'])

GL.hotkeys.add(hotkey, () => {
    let devices = GL?.stores?.phaser?.scene?.worldManager?.devices?.devicesInView
    let body = GL?.stores?.phaser?.mainCharacter?.body
    if(!devices || !body) return

    let closest = null;
    let closestDistance = Infinity;

    // find the closest interactible device
    for(let device of devices) {
        if(device.interactiveZones.zones.length == 0) continue
        let distance = Math.pow(device.x - body.x, 2) + Math.pow(device.y - body.y, 2)
        
        if(distance < closestDistance) {
            closest = device
            closestDistance = distance
        }
    }

    // trigger it
    if(closest) {
        closest.interactiveZones?.onInteraction?.()
    }
}, false)

export function onStop() {
    GL.hotkeys.remove(hotkey)
}