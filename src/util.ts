import { mount, type Component } from "svelte";
import type Lib from "./lib/lib";

// gotta have pretty console.logs
export function log(...args: any[]) {
    console.log('%c[GL]', 'color:#5030f2', ...args);
}

let keydownOverriding = false;
let keydownCallback: (e: KeyboardEvent) => void;

document.addEventListener("keydown", (e) => {
    if(!keydownOverriding) return;
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    keydownCallback(e);
}, true);

export function overrideKeydown(callback: (e: KeyboardEvent) => void) {
    keydownOverriding = true;
    keydownCallback = callback;
}

export function stopOverrideKeydown() {
    keydownOverriding = false;
}

export function renderSvelteComponent(component: Component, props: Record<string, any> = {}): [HTMLDivElement, Record<string, any>] {
    let div = document.createElement('div');
    div.style.display = "contents";

    let comp = mount(component, {
        target: div,
        props
    });

    return [div, comp];
}

export function readUserFile(accept: string) {
    return new Promise<string>((res, rej) => {
        let input = document.createElement('input');
        input.type = 'file';
        input.accept = accept;
    
        input.addEventListener('change', () => {
            let file = input.files?.[0];
            if(!file) return rej('No file selected');

            let reader = new FileReader();
            reader.onload = () => {
                res(reader.result as string);
            }
    
            reader.readAsText(file);
        });
    
        input.click();
    })
}

export const onGimkit = location.host === "www.gimkit.com";

export function parsePluginHeader(code: string) {
    const basePluginHeaders: Record<string, any> = {
        name: "Unnamed Plugin",
        description: "No description provided",
        author: "Unknown Author",
        version: null,
        reloadRequired: "false",
        isLibrary: "false",
        downloadUrl: null,
        needsLib: [],
        optionalLib: [],
        hasSettings: "false"
    };

    return parseHeader(code, basePluginHeaders);
}

export function parseLibHeader(code: string) {
    const baseLibHeaders: Record<string, any> = {
        name: 'Unnamed Library',
        author: 'Unknown Author',
        description: 'No description provided',
        version: null,
        downloadUrl: null,
        isLibrary: "false",
        reloadRequired: "false"
    }

    return parseHeader(code, baseLibHeaders);
}

export default function parseHeader(code: string, headers: Record<string, any>) {
    // parse headers for gimhook mods
    if(code.startsWith("// gimhook: ")) {
        try {
            let gimhookHeader = JSON.parse(code.slice(11, code.indexOf('\n')).trim());
            
            if(gimhookHeader.name) headers.name = gimhookHeader.name;
            if(gimhookHeader.description) headers.description = gimhookHeader.description;
            if(gimhookHeader.author) headers.author = gimhookHeader.author;
            if(gimhookHeader.version) headers.version = gimhookHeader.version;
        } catch(e) {}

        return headers;
    }
    
    // parse the JSDoc header at the start (if it exists)
    let closingIndex = code.indexOf('*/');
    if(!(code.trimStart().startsWith('/**')) || closingIndex === -1) {
        return headers;
    }

    let header = code.slice(0, closingIndex + 2);

    header = header.slice(3, -2).trim();
    let lines = header.split('\n');

    // remove the leading asterisks and trim the lines
    lines = lines.map(line => {
        let newLine = line.trimStart();
        if(newLine.startsWith('*')) {
            newLine = newLine.slice(1).trim();
        }
        return newLine;
    })

    let text = lines.join(' ');

    // go through and find all at symbols followed by non-whitespace
    // and that don't have a bracket before them if they are a link
    let validAtIndexes: number[] = [];

    let index: number = -1;
    while ((index = text.indexOf('@', index + 1)) !== -1) {
        if(text[index + 1] === ' ') continue;
        if(index != 0 && text[index - 1] === '{') {
            if(text.slice(index + 1, index + 5) === 'link') {
                continue;
            }
        }

        validAtIndexes.push(index);
    }

    for(let i = 0; i < validAtIndexes.length; i++) {
        let chunk = text.slice(validAtIndexes[i] + 1, validAtIndexes[i + 1] ?? text.length);
        let spaceIndex = chunk.indexOf(' ');
        let key = chunk.slice(0, spaceIndex !== -1 ? spaceIndex : chunk.length);
        let value = chunk.slice(key.length).trim();

        if(Array.isArray(headers[key])) {
            headers[key].push(value);
        } else {
            headers[key] = value;
        }
    }

    return headers;
}

export function confirmLibReload(libs: Lib[]) {
    let names = libs.map(l => l.headers.name);
    let msg = names.slice(0, -1).join(', ');
    if(names.length > 1) msg += ' and ';
    msg += names.at(-1);
    msg += names.length > 1 ? ' require' : ' requires';
    msg += ' a reload to function properly. Reload now?';

    return confirm(msg);
}