import Parcel from "$core/parcel";

export default class GimkitInternals {
    static stores: any;
    static notification: any;

    static init() {
        // window.stores
        Parcel.getLazy(null, exports => exports?.default?.characters, exports => {
            this.stores = exports.default;
            unsafeWindow.stores = exports.default;
        });

        // ant-design notifications
        Parcel.getLazy(null, exports => exports?.default?.useNotification, exports => {
            this.notification = exports.default;
        });
    }
}