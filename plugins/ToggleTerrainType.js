/**
 * @name ToggleTerrainType
 * @description Quickly toggle whether you are placing terrain as walls or as floor. Allows you to place tiles as floors in platformer mode.
 * @author TheLazySquid
 * @version 0.1.0
 * @downloadUrl https://raw.githubusercontent.com/TheLazySquid/Gimloader/main/plugins/ToggleTerrainType.js
 * @webpage https://thelazysquid.github.io/Gimloader/plugins/toggleterraintype
 */

const api = new GL();

api.hotkeys.addConfigurableHotkey({
    category: "ToggleTerrainType",
    title: "Switch between placing walls/floors",
    default: {
        key: "KeyT",
        alt: true
    }
}, () => {
    let terrain = GL.stores?.me?.adding?.terrain;
    if(!terrain) return;

    terrain.buildTerrainAsWall = !terrain.buildTerrainAsWall;

    api.notification.open({
        message: `Placing terrain as a ${terrain.buildTerrainAsWall ? 'wall' : 'floor'}`
    });
});