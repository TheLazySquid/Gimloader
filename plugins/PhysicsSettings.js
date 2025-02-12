/**
 * @name PhysicsSettings
 * @description Allows you to configure various things about the physics in platformer modes (client-side only)
 * @version 0.1.0
 * @author TheLazySquid
 * @downloadUrl https://raw.githubusercontent.com/TheLazySquid/Gimloader/main/plugins/PhysicsSettings.js
 * @webpage https://thelazysquid.github.io/Gimloader/plugins/physicssettings
 * @needsLib DLDUtils | https://raw.githubusercontent.com/TheLazySquid/Gimloader/main/libraries/DLDUtils.js
 * @needsLib QuickSettings | https://raw.githubusercontent.com/TheLazySquid/Gimloader/refs/heads/main/libraries/QuickSettings/build/QuickSettings.js
 */

const api = new GL();

const settings = api.lib("QuickSettings")("PhysicsSettings", [
    {
        type: "heading",
        text: "Physics Settings"
    },
    {
        type: "number",
        id: "jumps",
        title: "Number of Jumps (2 default)",
        min: 0,
        step: 1,
        default: 2
    },
    {
        type: "number",
        id: "jumpheight",
        title: "Jump Height (2 default)",
        default: 1.92
    },
    {
        type: "number",
        id: "speed",
        title: "Grounded Move Speed (310 default)",
        default: 310
    }
]);

api.openSettingsMenu(settings.openSettingsMenu);

const updateMapOption = (key, value) => {
    let options = JSON.parse(api.stores.world.mapOptionsJSON);
    options[key] = value;
    api.stores.world.mapOptionsJSON = JSON.stringify(options);
}

const applyAll = () => {
    let options = JSON.parse(api.stores.world.mapOptionsJSON);
    options.maxJumps = settings.jumps;
    options.jumpHeight = settings.jumpheight;
    api.stores.world.mapOptionsJSON = JSON.stringify(options);
}

api.net.onLoad(() => {
    if(api.stores?.session?.mapStyle !== 'platformer') return;

    api.net.room.state.listen("mapSettings", () => {
        applyAll();
    });

    api.stores.me.movementSpeed = settings.speed;

    settings.listen("jumps", (jumps) => updateMapOption("maxJumps", jumps));
    settings.listen("jumpheight", (height) => updateMapOption("jumpHeight", height));
    settings.listen("speed", (speed) => api.stores.me.movementSpeed = speed);
});