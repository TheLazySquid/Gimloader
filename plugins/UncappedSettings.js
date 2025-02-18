/**
 * @name UncappedSettings
 * @description Lets you start games with a much wider range of settings than normal
 * @author TheLazySquid
 * @version 0.1.1
 * @downloadUrl https://raw.githubusercontent.com/TheLazySquid/Gimloader/main/plugins/UncappedSettings.js
 * @webpage https://thelazysquid.github.io/Gimloader/plugins/uncappedsettings
 * @reloadRequired true
 */

const api = new GL();

function changeHooks(res) {
    for(let hook of res.hooks) {
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

api.parcel.getLazy(e => e?.requestAsPromise, exports => {
    api.patcher.before(exports, "request", (_, args) => {
        if(args[0].url !== "/api/experience/map/hooks") return;
        if(!args[0].success) return;

        let success = args[0].success;
        args[0].success = function(res) {
            changeHooks(res);
            return success.apply(this, arguments);
        }
    });
});