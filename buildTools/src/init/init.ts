import fs from 'fs';
import { input, confirm, checkbox } from '@inquirer/prompts';
import { join } from 'path';
import { execSync } from 'child_process';
import createGLConfig from './createGLConfig';

export default async function init() {
    const configPath = join(process.cwd(), 'GL.config.js');

    if(fs.existsSync(configPath)) {
        let conf = await confirm({
            message: "GL.config.js already exists. Do you want to continue?",
            default: false
        })

        if(!conf) return;
    }

    let name = await input({
        message: "Plugin name",
        required: true
    });

    let description = await input({
        message: "Plugin description",
        required: true
    });
    let author = await input({
        message: "Author",
        required: true
    });

    let plugins = await checkbox({
        message: "Select plugins (optional)",
        choices: [
            { name: "@rollup/plugin-typescript", value: "typescript" },
            { name: "@rollup/plugin-babel", value: "babel" },
            { name: "rollup-plugin-string", value: "string" },
            { name: "rollup-plugin-sass", value: "sass" },
            { name: "rollup-plugin-svelte", value: "svelte" }
        ]
    });

    let useTs = plugins.includes('typescript');
    
    let pkgPath = join(process.cwd(), 'package.json')
    // create the package.json if it doesn't exist
    if(!fs.existsSync(pkgPath)) {
        console.log('Creating package.json...');
        fs.writeFileSync(pkgPath, JSON.stringify({
            name: name.toLowerCase().replace(/ /g, '-'),
            version: '1.0.0',
            description: description,
            author: author,
            main: useTs ? 'src/index.ts' : 'src/index.js',
            scripts: {
                build: "gl build"
            },
            type: 'module',
            dependencies: {},
            devDependencies: {}
        }, null, 2))
    }
    
    if(plugins.length > 0) {
        // install dependencies
        console.log('Installing dependencies...');

        let devDeps = {
            'typescript': '@rollup/plugin-typescript tslib gimloader@github:TheLazySquid/Gimloader',
            'babel': '@rollup/plugin-babel @babel/preset-react',
            'string': 'rollup-plugin-string',
            'sass': 'rollup-plugin-sass',
            'svelte': 'svelte rollup-plugin-svelte @rollup/plugin-node-resolve @sveltejs/vite-plugin-svelte'
        }
    
        let installStr = 'npm install --save-dev';
        
        for(let plugin of plugins) {
            installStr += ` ${devDeps[plugin]}`;
        }
    
        execSync(installStr, { stdio: 'inherit' });
    }

    // create .babelrc
    if(plugins.includes('Babel')) {
        console.log('Creating .babelrc...');
        fs.writeFileSync(join(process.cwd(), '.babelrc'), JSON.stringify({
            presets: ['@babel/preset-react']
        }, null, 4));
    }

    // create GL.config.js
    console.log('Creating GL.config.js...');
    let config = createGLConfig(name, description, author, plugins);
    fs.writeFileSync(configPath, config);
    
    // create main file
    console.log('Creating main file...');
    let mainPath = join(process.cwd(), 'src', `index.${useTs ? 'ts' : 'js'}`);
    if(!fs.existsSync(mainPath)) {
        // create src folder
        if(!fs.existsSync(join(process.cwd(), 'src'))) {
            fs.mkdirSync(join(process.cwd(), 'src'));
        }

        let starterFile = '';

        if(useTs) starterFile += "/// <reference types='gimloader' />\n\n";
        starterFile += "console.log('Hello, World!')";

        fs.writeFileSync(mainPath, starterFile);
    }

    console.log('Done!');
}