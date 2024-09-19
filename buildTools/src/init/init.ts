import fs from 'fs';
import { input, confirm, checkbox, select } from '@inquirer/prompts';
import { join, basename } from 'path';
import createPackageJson from './createPackageJson'
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
        required: true,
        default: basename(process.cwd())
    });
    
    let description = await input({
        message: "Plugin description",
        required: true
    });

    let author = await input({
        message: "Author",
        required: true
    });

    let bundler = await select({
        message: "Which bundler would you like to use?",
        choices: [
            {
                name: "Esbuild",
                value: "esbuild"
            },
            {
                name: "Rollup",
                value: "rollup"
            }
        ]
    });

    let plugins: string[];
    let useTs = false;

    if(bundler === "esbuild") {
        plugins = await checkbox({
            message: "Select plugins (optional)",
            choices: [
                { name: "typescript", value: "esbuild-typescript" },
                { name: "esbuild-svelte", value: "esbuild-svelte" }
            ]
        });

        useTs = plugins.includes('esbuild-typescript');
    } else {
        plugins = await checkbox({
            message: "Select plugins (optional)",
            choices: [
                { name: "@rollup/plugin-typescript", value: "typescript" },
                { name: "@rollup/plugin-babel", value: "babel" },
                { name: "rollup-plugin-string", value: "string" },
                { name: "rollup-plugin-sass", value: "sass" },
                { name: "rollup-plugin-svelte", value: "svelte" }
            ]
        });

        useTs = plugins.includes('typescript');
    }
    
    // create the package.json if it doesn't exist
    createPackageJson(name, description, author, useTs, plugins);

    // create .gitignore
    if(!fs.existsSync(join(process.cwd(), '.gitignore'))) {
        console.log('Creating .gitignore...');
        fs.writeFileSync(join(process.cwd(), '.gitignore'), 'node_modules');
    }

    // create .babelrc
    if(plugins.includes('babel')) {
        console.log('Creating .babelrc...');
        fs.writeFileSync(join(process.cwd(), '.babelrc'), JSON.stringify({
            presets: ['@babel/preset-react']
        }, null, 4));
    }

    // create GL.config.js
    console.log('Creating GL.config.js...');
    let config = createGLConfig(name, description, author, bundler, useTs, plugins);
    fs.writeFileSync(configPath, config);
    
    // create main file
    console.log('Creating main file...');
    let mainPath = join(process.cwd(), 'src', `index.${useTs ? 'ts' : 'js'}`);
    if(!fs.existsSync(mainPath)) {
        // create src folder
        if(!fs.existsSync(join(process.cwd(), 'src'))) {
            fs.mkdirSync(join(process.cwd(), 'src'));
        }
        
        fs.writeFileSync(mainPath, "console.log('Hello, World!')");
    }

    console.log('Done! Run npm install to get started.');
}