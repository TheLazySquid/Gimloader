import Parcel from "$core/parcel";

export default class GimkitInternals {
    static stores: any;
    static notification: any;
    static platformerPhysics: any;

    static init() {
        // window.stores
        Parcel.getLazy(null, exports => exports?.default?.characters, exports => {
            this.stores = exports.default;
            window.stores = exports.default;
        });

        // ant-design notifications
        Parcel.getLazy(null, exports => exports?.default?.useNotification, exports => {
            this.notification = exports.default;
        });

        // platformer physics
        Parcel.getLazy(null, exports => exports?.CharacterPhysicsConsts, exports => {
            this.platformerPhysics = exports.CharacterPhysicsConsts;
            window.platformerPhysics = exports.CharacterPhysicsConsts;
        })
    }
}