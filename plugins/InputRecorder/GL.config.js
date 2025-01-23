import fs from 'fs';

let pkg = JSON.parse(fs.readFileSync('./package.json'));

/** @type {import('@gimloader/build').Config} */
export default {
    input: "./src/index.ts",
    name: "InputRecorder",
    description: "Records your inputs in Don't Look Down",
    author: "TheLazySquid",
    version: pkg.version,
    reloadRequired: 'ingame',
    downloadUrl: "https://raw.githubusercontent.com/TheLazySquid/Gimloader/main/plugins/InputRecorder/build/InputRecorder.js",
    libs: ["DLDUtils | https://raw.githubusercontent.com/TheLazySquid/Gimloader/main/libraries/DLDUtils.js"]
}