/**
 * @name ShowHitboxes
 * @description Enables debug mode which shows hitboxes
 * @author TheLazySquid
 * @version 0.2.0
 * @downloadUrl https://raw.githubusercontent.com/TheLazySquid/Gimloader/main/plugins/ShowHitboxes.js
 * @webpage https://thelazysquid.github.io/Gimloader/plugins/showhitboxes
 * @reloadRequired ingame
 */

const api = new GL();

api.parcel.getLazy((m) => m?.PhysicsConstants, (exports) => {
  exports.PhysicsConstants.debug = true;
});