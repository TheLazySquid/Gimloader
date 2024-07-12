import type { Config, GLConfig } from '../types';
import { existsSync } from 'fs';
import { join } from 'path';
import { pathToFileURL } from 'url';

export default function getConfig() {
    return new Promise<Config>(async (res, rej) => {
        const configPath = join(process.cwd(), 'GL.config.js');

        if(!existsSync(configPath)) {
            rej('GL.config.js not found! Run gl init to create one.');
            return;
        }

        const config: GLConfig = await import(`${pathToFileURL(configPath).href}?t=${Date.now()}`);

        // do some checks
        if(!config.default) {
            rej("GL.config.js doesn't export a default value!");
            return;
        }
    
        let mandatoryStrings = ['input', 'name', 'description', 'author'];
        for(let str of mandatoryStrings) {
            let type = typeof config.default[str];
            if(type === 'undefined') {
                rej(`GL.config.js is missing the ${str} field!`);
                return;
            }
    
            if(type !== 'string') {
                rej(`GL.config.js ${str} field is not a string!`);
                return;
            }
        }
    
        let optionalArrays = ['libs', 'optionalLibs', 'plugins'];
    
        for(let arr of optionalArrays) {
            if(config.default[arr]) {
                if(!Array.isArray(config.default[arr])) {
                    rej(`GL.config.js ${arr} field is not an array!`);
                    return;
                }
            }
        }
    
        res(config.default);
    })
}