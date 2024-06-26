import fs from 'fs';
import { join } from 'path';
import inquirer from 'inquirer';
import { execSync } from 'child_process';

export default async function init() {
    const configPath = join(process.cwd(), 'GL.config.js');
    if (fs.existsSync(configPath)) {
        let answers = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'overwrite',
                message: 'GL.config.js already exists. Overwrite?',
                default: false
            }
        ]);

        if (!answers.overwrite) {
            return;
        }
    }

    const ui = new inquirer.ui.BottomBar();
    let answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Plugin Name',
            validate: input => input !== ''
        },
        {
            type: 'input',
            name: 'description',
            message: 'Plugin Description',
            validate: input => input !== ''
        },
        {
            type: 'input',
            name: 'author',
            message: 'Author',
            validate: input => input !== ''
        },
        {
            type: 'checkbox',
            name: 'plugins',
            message: 'Select Plugins (optional)',
            choices: ['Typescript', 'Babel', 'String', 'Sass']
        }
    ])

    
    let useTs = answers.plugins.includes('Typescript');
    
    let pkgPath = join(process.cwd(), 'package.json')
    // create the package.json if it doesn't exist
    if(!fs.existsSync(pkgPath)) {
        ui.log.write('Creating package.json...');
        fs.writeFileSync(pkgPath, JSON.stringify({
            name: answers.name.toLowerCase().replace(/ /g, '-'),
            version: '1.0.0',
            description: answers.description,
            author: answers.author,
            main: useTs ? 'src/index.ts' : 'src/index.js',
            scripts: {
                build: "gl build"
            },
            type: 'module',
            dependencies: {},
            devDependencies: {}
        }, null, 2))
    }

    // install dependencies
    ui.log.write('Installing dependencies...');

    let devDeps = {
        'Typescript': '@rollup/plugin-typescript gimloader@github:TheLazySquid/Gimloader',
        'Babel': '@rollup/plugin-babel @babel/preset-react',
        'String': 'rollup-plugin-string',
        'Sass': 'rollup-plugin-sass'
    }

    let installStr = 'npm install --save-dev';
    
    for(let plugin of answers.plugins) {
        installStr += ` ${devDeps[plugin]}`;
    }

    execSync(installStr, { stdio: 'inherit' });

    // create .babelrc
    if(answers.plugins.includes('Babel')) {
        ui.log.write('Creating .babelrc...');
        fs.writeFileSync(join(process.cwd(), '.babelrc'), JSON.stringify({
            presets: ['@babel/preset-react']
        }, null, 4));
    }

    // create GL.config.js
    ui.log.write('Creating GL.config.js...');

    let config = "";

    if(answers.plugins.includes('Typescript')) {
        config += `import typescript from '@rollup/plugin-typescript';\n`;
    }
    if(answers.plugins.includes('Babel')) {
        config += `import babel from '@rollup/plugin-babel';\n`;
    }
    if(answers.plugins.includes('String')) {
        config += `import { string } from 'rollup-plugin-string';\n`;
    }
    if(answers.plugins.includes('Sass')) {
        config += `import sass from 'rollup-plugin-sass';\n`;
    }

    config += `
import fs from 'fs';

const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));

export default {
    input: 'src/index.${useTs ? 'ts' : 'js'}',
    name: '${answers.name}',
    description: '${answers.description}',
    author: '${answers.author}',
    version: pkg.version,
    plugins: [`;

    let pluginStrs = [];

    if(answers.plugins.includes('Sass')) {
        pluginStrs.push(`        sass()`);
    }
    if(answers.plugins.includes('String')) {
        pluginStrs.push(`        string({ include: ['**/*.css', '**/*.svg'] })`);
    }
    if(answers.plugins.includes('Babel')) {
        pluginStrs.push(`        babel({ include: ['src/**/*.jsx', 'src/**/*.tsx'], babelHelpers: 'bundled' })`);
        if(answers.plugins.includes('Typescript')) {
            pluginStrs.push(`        typescript({
            jsx: 'react',
            target: 'esnext'
        })`);
        }
    } else if(answers.plugins.includes('Typescript')) {
        pluginStrs.push(`        typescript({
            target: 'esnext'
        })`);
    }

    if(pluginStrs.length > 0) {
        config += "\n" + pluginStrs.join(',\n') + "\n   ]\n};";
    } else {
        config += ']\n};';
    }

    fs.writeFileSync(configPath, config);
    ui.log.write('Creating main file...');
    
    // create main file
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

    ui.log.write('Done!');
}
