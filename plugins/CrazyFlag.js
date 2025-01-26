/**
 * @name CrazyFlag
 * @description Make the flags in capture the flag or creative swing like crazy!
 * @author TheLazySquid
 * @version 1.1.2
 * @webpage https://thelazysquid.github.io/Gimloader/plugins/crazyflag
 * @needsLib QuickSettings | https://raw.githubusercontent.com/TheLazySquid/Gimloader/refs/heads/main/libraries/QuickSettings/build/QuickSettings.js
 * @hasSettings true
 */
const api = new GL();

let settings = api.lib("QuickSettings")("CrazyFlag", [
    { type: "heading", text: "Crazy Flag Settings" },
    {
        type: "number",
        id: "swingSpeed",
        title: "Swing Speed (1 = default)",
        default: 2,
        min: 0
    },
    {
        type: "number",
        id: "swingAmount",
        title: "Swing Amount (1 = default)",
        default: 120,
        min: 0
    }
]);
api.openSettingsMenu(settings.openSettingsMenu);

let flagConsts;

function applySettings() {
    if(!flagConsts) return;
    flagConsts.FlagSwingInterval = 1 / settings.swingSpeed;
    flagConsts.FlagSwingAmplitude = settings.swingAmount / 10;
}

settings.listen("swingSpeed", applySettings);
settings.listen("swingAmount", applySettings);

api.parcel.getLazy(exports => exports?.Consts?.FlagSwingInterval, exports => {
    let defaults = Object.assign({}, exports.Consts);
    flagConsts = exports.Consts;
    applySettings();

    api.onStop(() => {
        Object.assign(flagConsts, defaults);
    });
});