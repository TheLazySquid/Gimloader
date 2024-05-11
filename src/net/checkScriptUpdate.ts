import { version } from '../../package.json';
import { parseHeader, type Plugin } from '../loadPlugins';

const scriptUrl = "https://raw.githubusercontent.com/TheLazySquid/Gimloader/main/build/bundle.user.js";

export async function checkScriptUpdate() {
    const res = await GL.net.corsRequest({ url: scriptUrl })
        .catch(() => {
            alert("Failed to check for updates. Did you allow Gimloader to make Cross-Origin requests?");
        })

    if(!res) return;
    
    const versionPrefix = '// @version';
    let index = res.responseText.indexOf(versionPrefix) + versionPrefix.length;
    let incomingVersion = res.responseText.slice(index, res.responseText.indexOf('\n', index)).trim();

    // compare versions
    let comparison = compareVersions(version, incomingVersion);
    if(comparison === 'same') alert("This script is up to date!");
    else if(comparison === 'newer') {
        let confirm = window.confirm(`A new version of Gimloader is available! Would you like to update?`);
        if(confirm) {
            window.location.href = scriptUrl;
        }
    } else {
        alert("You are using a newer version of Gimloader than the one available on GitHub.");
    }
}

export async function checkPluginUpdate(plugin: Plugin, rerender: () => void) {
    if(!plugin.headers.downloadUrl) return;

    const res = await GL.net.corsRequest({ url: plugin.headers.downloadUrl })
        .catch(() => {
            alert("Failed to check for updates. Did you allow Gimloader to make Cross-Origin requests?");
        })

    if(!res) return;

    let incomingHeaders = parseHeader(res.responseText);
    if(res.responseText === plugin.script) alert("This plugin is up to date!");

    let confirm: boolean;
    let comparison = compareVersions(plugin.headers.version ?? '', incomingHeaders.version ?? '');
    
    let changeStr = `(${plugin.headers.version} -> ${incomingHeaders.version})`;
    if(comparison === 'same') {
        confirm = window.confirm(`A different version of ${plugin.headers.name} is available ${changeStr}. Would you like to switch?`);
    } else if (comparison === 'newer') {
        confirm = window.confirm(`You are using a newer version of ${plugin.headers.name} than the one available on GitHub ${changeStr}. Would you like to switch?`);
    } else {
        confirm = window.confirm(`A new version of ${plugin.headers.name} is available ${changeStr}! Would you like to update?`);
    }

    if(confirm) {
        plugin.disable();
        plugin.script = res.responseText;
        plugin.headers = incomingHeaders;
        plugin.enable();
    }

    rerender();
}

function compareVersions(v1: string, v2: string): 'same' | 'newer' | 'older' {
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