/**
 * @name MobxUtils
 * @description Some simple utilities for react injection with MobX
 * @author TheLazySquid
 * @version 0.2.0
 * @downloadUrl https://raw.githubusercontent.com/TheLazySquid/Gimloader/main/libraries/MobxUtils.js
 * @isLibrary true
 * @reloadRequired true
 */

const api = new GL();

let observerIntercepts = [];

api.parcel.getLazy(exports => exports && Object.keys(exports).length === 1 && exports?.observer, exports => {
    api.patcher.before(exports, 'observer', (_, args) => {
        // this is our only good way of telling apart functions
        let str = args[0].toString();
        for(let intercept of observerIntercepts) {
            if(intercept.match(str)) {
                let newVal = intercept.callback(args[0]);
                if(newVal) args[0] = newVal;
            }
        }
    });
});

export function interceptObserver(id, match, callback) {
    observerIntercepts.push({ match, callback, id });
}

export function stopIntercepts(id) {
    observerIntercepts = observerIntercepts.filter(intercept => intercept.id !== id);
}