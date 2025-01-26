import { sassPlugin } from "esbuild-sass-plugin";
import fs from 'fs';

const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));

/** @type { import('@gimloader/build').Config } */
export default {
    input: 'src/index.ts',
    name: 'CustomUI',
    description: 'Allows you to customize various things about the Gimkit UI',
    author: 'TheLazySquid',
    version: pkg.version,
    webpage: 'https://thelazysquid.github.io/Gimloader/plugins/customui',
    hasSettings: true,
    plugins: [sassPlugin({ type: "css-text" })]
}