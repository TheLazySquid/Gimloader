import { Config } from '../types';

export default function addHeadersPlugin(config: Config) {
    let meta = `/**
 * @name ${config.name}
 * @description ${config.description}
 * @author ${config.author}`;

    if(config.version) {
        meta += `\n * @version ${config.version}`;
    }

    if(config.reloadRequired === true) {
        meta += '\n * @reloadRequired true';
    } else if(config.reloadRequired === "ingame") {
        meta += '\n * @reloadRequired ingame';
    }

    if(config.downloadUrl) {
        meta += `\n * @downloadUrl ${config.downloadUrl}`;
    }

    if(config.libs) {
        for(let lib of config.libs) {
            meta += `\n * @needsLib ${lib}`;
        }
    }

    if(config.optionalLibs) {
        for(let lib of config.optionalLibs) {
            meta += `\n * @optionalLib ${lib}`;
        }
    }

    if(config.isLibrary) {
        meta += '\n * @isLibrary true';
    }

    meta += '\n */\n';

    return {
        name: 'addMeta',
        renderChunk(code: string) {
            return meta + code;
        }
    }
}