/**
 * @name UncappedSettings
 * @description Lets you start games with a much wider range of settings than normal
 * @author TheLazySquid
 * @version 0.1.0
 * @downloadUrl https://raw.githubusercontent.com/TheLazySquid/Gimloader/main/plugins/UncappedSettings.js
 * @webpage https://thelazysquid.github.io/Gimloader/plugins/uncappedsettings
 * @reloadRequired true
 */

const api = new GL();

function changeHooks(res) {
    for(let hook of res.data.hooks) {
        let key = hook.key.toLowerCase();

        if(key.includes("duration")) {
            // uncap duration
            hook.options.min = 1;
            hook.options.max = 60;
        } else if(key.includes("question")) {
            // uncap energy/other stuff per question
            hook.options.min = -1e11 + 1;
            hook.options.max = 1e11 - 1; // 100 billion - 1
        }
    }
}

api.parcel.getLazy(exports => exports?.default?.toString?.().includes("response:new(0"), exports => {
    let Requester = exports.default;
    delete exports.default;
    exports.default = class extends Requester {
        request(e, t) {
            let req = super.request(e, t);

            if (e.url === "/api/experience/map/hooks") {
                req.then((res) => {
                    changeHooks(res);
                });
            }

            return req;
        }
    }

    api.onStop(() => exports.default = Requester);
});