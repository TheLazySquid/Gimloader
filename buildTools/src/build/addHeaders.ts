import type { Config, IPluginTypes } from '../types';

export function createHeader(config: Config) {
    let meta = `/**
 * @name ${config.name}
 * @description ${config.description}
 * @author ${config.author}`;
   
    if(config.version) {
        meta += `\n * @version ${config.version}`;
    }

    if(config.downloadUrl) {
        meta += `\n * @downloadUrl ${config.downloadUrl}`;
    }

    if(config.reloadRequired === true) {
        meta += '\n * @reloadRequired true';
    } else if(config.reloadRequired === "ingame") {
        meta += '\n * @reloadRequired ingame';
    }

    if(!config.isLibrary) {
        let pluginConfig = config as IPluginTypes;
        if(pluginConfig.libs) {
            for(let lib of pluginConfig.libs) {
                meta += `\n * @needsLib ${lib}`;
            }
        }
    
        if(pluginConfig.optionalLibs) {
            for(let lib of pluginConfig.optionalLibs) {
                meta += `\n * @optionalLib ${lib}`;
            }
        }

        if(pluginConfig.hasSettings) {
            meta += '\n * @hasSettings true'
        }
    }

    if(config.isLibrary) {
        meta += '\n * @isLibrary true';
    }

    meta += '\n */\n';
   
    return meta;
}

export function addHeadersPlugin(config: Config) {
    let meta = createHeader(config);

    return {
        name: 'addMeta',
        renderChunk(code: string) {
            return meta + code;
        }
    }
}