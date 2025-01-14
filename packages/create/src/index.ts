#!/usr/bin/env node
import { input, confirm, select } from '@inquirer/prompts';
import { resolve, join } from "path";
import fs from 'fs';
import { createPackage } from './createPackage.js';
import chalk from 'chalk';

process.on('uncaughtException', (error) => {
    if(error instanceof Error && error.name === "ExitPromptError") return;
})

init();

async function init() {
    let directory = await input({
        message: "Where would you like to create your project? (Leave blank for current directory)"
    });
    
    let path = resolve(directory);

    // if the path exists make sure it's empty
    if(fs.existsSync(path)) {
        if(fs.readdirSync(path).length > 0) {
            let conf = await confirm({
                message: "That folder is non-empty, do you wish to proceed?",
                default: false
            });
            if(!conf) return;
        }
    }

    let type = await select({
        message: "Would you like to make a plugin or a library?",
        choices: [
            { name: "Plugin", value: "plugin" },
            { name: "Library", value: "library" }
        ]
    });
    let capitalized = type[0].toUpperCase() + type.slice(1);

    let name = await input({
        message: `${capitalized} name:`,
        validate: (v) => v != ""
    });
    
    let description = await input({
        message: `${capitalized} description:`,
        validate: (v) => v != ""
    });

    let author = await input({
        message: `${capitalized} author:`,
        validate: (v) => v != ""
    });

    let useTs = await confirm({
        message: "Would you like to use typescript?"
    });

    if(!fs.existsSync(path)) {
        fs.mkdirSync(path, { recursive: true });
    }

    const srcPath = join(path, "src");
    if(!fs.existsSync(srcPath)) {
        fs.mkdirSync(srcPath);
    }

    // create the input file
    const file = "import GL from 'gimloader';\n\n" + 
        "GL.net.onLoad(() => console.log('hello world!'));";

    let inputFile = useTs ? 'index.ts' : 'index.js';
    fs.writeFileSync(join(path, "src", inputFile), file);

    // create GL.config.js
    let configFile = `import fs from 'fs';

const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));

/** @type {import('@gimloader/build').Config} */
export default {
    input: "./src/${inputFile}",
    name: "${name}",
    description: "${description}",
    author: "${author}",
    version: pkg.version
}`;

    fs.writeFileSync(join(path, 'GL.config.js'), configFile);

    // create .gitignore
    fs.writeFileSync(join(path, ".gitignore"), "node_modules");

    createPackage(path, name, description, author);

    console.log(`Done! Run ${chalk.italic('npm run build')} or ${chalk.italic('npm run serve')} to get started.`);
}