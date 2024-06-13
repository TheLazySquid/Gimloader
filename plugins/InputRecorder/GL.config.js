import typescript from '@rollup/plugin-typescript';
import fs from 'fs';

let pkg = JSON.parse(fs.readFileSync('./package.json'));

export default {
    input: "./src/index.ts",
    name: "InputRecorder",
    description: "Records your inputs in Don't Look Down",
    author: "TheLazySquid",
    version: pkg.version,
    reloadRequired: true,
    downloadUrl: "https://raw.githubusercontent.com/TheLazySquid/Gimloader/main/plugins/InputRecorder/build/InputRecorder.js",
    plugins: [
        typescript({
            target: "es2022"
        })
    ]
}