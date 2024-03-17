/**
 * @name InstantUse
 * @description Instantly use nearby devices without any wait
 * @author TheLazySquid
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
})

export function onStop() {
    GL.hotkeys.remove(hotkey)
}