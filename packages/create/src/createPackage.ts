import fs from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';
import chalk from 'chalk';
import { packageManager } from './env.js';

export function createPackage(path: string, name: string, description: string, author: string) {
    process.stdout.write('⏳' + chalk.bold('Installing dependencies'));

    let pkg = {
        name: name.toLowerCase().replaceAll(" ", "-"),
        version: "1.0.0",
        description,
        type: "module",
        scripts: {
            build: "gl build",
            serve: "gl serve"
        },
        author
    };

    fs.writeFileSync(join(path, 'package.json'), JSON.stringify(pkg, null, 2));

    if(packageManager === "bun") {
        execSync('bun add -D @gimloader/build', { cwd: path });
        execSync('bun add gimloader', { cwd: path });
    } else {
        execSync('npm i -D @gimloader/build', { cwd: path });
        execSync('npm i gimloader', { cwd: path });
    }

    console.log('\x1b[2K\r' + chalk.green('✔') + chalk.bold(' Installing dependencies'))
}