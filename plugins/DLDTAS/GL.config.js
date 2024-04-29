import typescript from '@rollup/plugin-typescript';
import sass from 'rollup-plugin-sass';
import { string } from 'rollup-plugin-string';

export default {
    input: "./src/index.ts",
    name: "DLDTAS",
    description: "Allows you to create TASes for Dont Look Down",
    author: "TheLazySquid",
    plugins: [
        typescript({
            target: "es2022"
        }),
        sass(),
        string({ include: ['**/*.css'] }),
    ]
}