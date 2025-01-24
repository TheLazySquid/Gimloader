/**
 * @name InstantUse
 * @description Instantly use nearby devices without any wait
 * @author TheLazySquid
 * @version 0.2.0
 * @downloadUrl https://raw.githubusercontent.com/TheLazySquid/Gimloader/main/plugins/InstantUse.js
 */

const api = new GL();

api.hotkeys.addHotkey({
    key: "Enter",
    preventDefault: false
}, () => {
    let devices = api.stores?.phaser?.scene?.worldManager?.devices;
    let body = api.stores?.phaser?.mainCharacter?.body;
    if(!devices || !body) return

    let device = devices.interactives.findClosestInteractiveDevice(devices.devicesInView, body.x, body.y);

    // trigger it
    if(device) {
        device.interactiveZones?.onInteraction?.()
    }
});