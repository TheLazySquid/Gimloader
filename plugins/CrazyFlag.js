/**
 * @name CrazyFlag
 * @description Make the flags in capture the flag or creative swing like crazy!
 * @author TheLazySquid
 * @version 1.0.1
 * @needsLib QuickSettings | https://raw.githubusercontent.com/TheLazySquid/Gimloader/refs/heads/main/libraries/QuickSettings/build/QuickSettings.js
 * @hasSettings true
 */

let settings = GL.lib("QuickSettings")("CrazyFlag", [
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

let flagConsts;

function applySettings() {
    if(!flagConsts) return;
    flagConsts.FlagSwingInterval = 1 / settings.swingSpeed;
    flagConsts.FlagSwingAmplitude = settings.swingAmount / 10;
}

settings.listen("swingSpeed", applySettings);
settings.listen("swingAmount", applySettings);

GL.parcel.interceptRequire("CrazyFlag", exports => exports?.Consts?.FlagSwingInterval, exports => {
    flagConsts = exports.Consts;
    applySettings();
});

export function onStop() {
    GL.parcel.stopIntercepts("CrazyFlag");
}

export const openSettingsMenu = settings.openSettingsMenu;