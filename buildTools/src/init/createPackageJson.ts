import fs from "fs";
import { join } from "path";
import { version } from "../../package.json";

let dependencies = {
    'typescript': ['@rollup/plugin-typescript', 'tslib', '@types/gimloader'],
    'babel': ['@rollup/plugin-babel', '@babel/preset-react'],
    'string': ['rollup-plugin-string'],
    'sass': ['rollup-plugin-sass'],
    'svelte': ['svelte rollup-plugin-svelte', '@rollup/plugin-node-resolve', 'svelte-preprocess'],
    'esbuild-svelte': ['svelte', 'esbuild-svelte', 'svelte-preprocess']
}

// these are hardcoded, which may lead to problems in the future
let versions = {
    "@rollup/plugin-typescript": "11.1.6",
    "tslib": "2.7.0",
    "@types/gimloader": "github:TheLazySquid/Gimloader",
    "@rollup/plugin-babel": "6.0.4",
    "@babel/preset-react": "7.24.7",
    "rollup-plugin-string": "3.0.0",
    "rollup-plugin-sass": "1.13.2",
    "svelte": "4.2.19",
    "rollup-plugin-svelte": "7.2.2",
    "@rollup/plugin-node-resolve": "15.2.3",
    "svelte-preprocess": "6.0.2",
    "esbuild-svelte": "0.8.2",
    "@gimloader/build": version
}

export default function createPackageJson(name: string, description: string, author: string, useTs: boolean, plugins: string[]) {
    let pkgPath = join(process.cwd(), 'package.json')
    let pkg: any = {};
    if(fs.existsSync(pkgPath)) {
        pkg = JSON.parse(fs.readFileSync(pkgPath).toString());
    } else {
        pkg = {
            name: name.toLowerCase().replace(/ /g, '-'),
            version: '1.0.0',
            description,
            author,
            main: useTs ? 'src/index.ts' : 'src/index.js',
            scripts: {
                build: "gl build",
                serve: "gl serve -m"
            },
            type: 'module',
            dependencies: {},
            devDependencies: {}
        }
    }

    if(!pkg.dependencies) pkg.dependencies = {};
    if(!pkg.devDependencies) pkg.devDependencies = {};

    let installed = Object.values(pkg.dependencies).concat(Object.values(pkg.devDependencies));

    for(let plugin of plugins) {
        let deps = dependencies[plugin];
        for(let dep of deps) {
            if(installed.includes(dep)) continue;

            pkg.devDependencies[dep] = versions[dep];
        }
    }

    if(!installed.includes("@gimloader/build")) {
        pkg.devDependencies["@gimloader/build"] = versions["@gimloader/build"];
    }

    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
}