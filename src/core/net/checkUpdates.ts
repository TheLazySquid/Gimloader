import type Lib from "$core/libManager/lib";
import type Plugin from '../pluginManager/plugin.svelte';
import { version } from "$src/consts.svelte";
import { parseLibHeader, parsePluginHeader } from '$src/parseHeader';
import Net from "./net";
import LibManager from "../libManager/libManager.svelte";

export const scriptUrl = "https://raw.githubusercontent.com/TheLazySquid/Gimloader/main/build/bundle.user.js";

export async function checkScriptUpdate(manual: boolean) {
    const res = await Net.corsRequest({ url: scriptUrl })
        .catch(() => {
            alert("Failed to check for updates. Did you allow Gimloader to make Cross-Origin requests?");
        })

    if(!res) return;
    
    const versionPrefix = '// @version';
    let index = res.responseText.indexOf(versionPrefix) + versionPrefix.length;
    let incomingVersion = res.responseText.slice(index, res.responseText.indexOf('\n', index)).trim();

    // compare versions
    let comparison = compareVersions(version, incomingVersion);
    if(comparison === 'same') {
        if(manual) alert("This script is up to date!");
    } else if(comparison === 'older') {
        let conf = confirm(`A new version of Gimloader is available (v${incomingVersion})! Would you like to update?`);
        if(conf) {
            window.location.href = scriptUrl;
        }
    } else if(manual) {
        alert("You are using a newer version of Gimloader than the one available on Github.");
    }
}

export async function checkPluginUpdate(plugin: Plugin) {
    if(!plugin.headers.downloadUrl) return;

    const res = await GL.net.corsRequest({ url: plugin.headers.downloadUrl })
        .catch(() => {
            alert("Failed to check for updates. Did you allow Gimloader to make Cross-Origin requests?");
        })

    if(!res) return;

    let incomingHeaders = parsePluginHeader(res.responseText);
    if(res.responseText === plugin.script) { 
        alert("This plugin is up to date!");
        return
    }

    let conf: boolean;
    let comparison = compareVersions(plugin.headers.version ?? '', incomingHeaders.version ?? '');
    
    let changeStr = `(${plugin.headers.version} -> ${incomingHeaders.version})`;
    if(comparison === 'same') {
        conf = confirm(`A different version of ${plugin.headers.name} is available ${changeStr}. Would you like to switch?`);
    } else if (comparison === 'newer') {
        conf = confirm(`You are using a newer version of ${plugin.headers.name} than the remote one ${changeStr}. Would you like to switch?`);
    } else {
        conf = confirm(`A new version of ${plugin.headers.name} is available ${changeStr}! Would you like to update?`);
    }

    if(conf) {
        plugin.edit(res.responseText, incomingHeaders);
    }
}

export async function checkLibUpdate(lib: Lib) {
    if(!lib.headers.downloadUrl) return;

    const res = await GL.net.corsRequest({ url: lib.headers.downloadUrl })
        .catch(() => {
            alert("Failed to check for updates. Did you allow Gimloader to make Cross-Origin requests?");
        })
        
    if(!res) return;

    let incomingHeaders = parseLibHeader(res.responseText);
    if(res.responseText === lib.script) { 
        alert("This library is up to date!");
        return
    }

    let conf: boolean;
    let comparison = compareVersions(lib.headers.version ?? '', incomingHeaders.version ?? '');
    
    let changeStr = `(${lib.headers.version} -> ${incomingHeaders.version})`;
    if(comparison === 'same') {
        conf = confirm(`A different version of ${lib.headers.name} is available ${changeStr}. Would you like to switch?`);
    } else if (comparison === 'newer') {
        conf = confirm(`You are using a newer version of ${lib.headers.name} than the remote one ${changeStr}. Would you like to switch?`);
    } else {
        conf = confirm(`A new version of ${lib.headers.name} is available ${changeStr}! Would you like to update?`);
    }

    if(conf) {
        LibManager.deleteLib(lib);
        LibManager.createLib(res.responseText, incomingHeaders);
    }
}

export function compareVersions(v1: string, v2: string): 'same' | 'newer' | 'older' {
    if(v1 === v2) return 'same';
    if(!v1 || !v2) return 'newer';

    let parts1 = v1.split('.');
    let parts2 = v2.split('.');

    for(let i = 0; i < parts1.length; i++) {
        let p1 = parseInt(parts1[i]);
        let p2 = parseInt(parts2[i]);

        if(isNaN(p1) || isNaN(p2)) return 'newer';

        if(p1 !== p2) {
            return p1 > p2 ? 'newer' : 'older';
        }
    }

    return 'same';
}