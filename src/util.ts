import type { ComponentType, SvelteComponent } from "svelte";
import type { EasyAccessWritable } from "./types";

// gotta have pretty console.logs
export function log(...args: any[]) {
    console.log('%c[GL]', 'color:#5030f2', ...args);
}

export function easyAccessWritable<T>(initial: T): EasyAccessWritable<T> {
    let callbacks = new Set<(value: T) => void>();

    return {
        value: initial,
        set(value: T) {
            this.value = value;
            for(let callback of callbacks) {
                callback(value);
            }
        },
        update() {
            for(let callback of callbacks) {
                callback(this.value);
            }
        },
        subscribe(callback: (value: T) => void) {
            callbacks.add(callback);
            callback(this.value);

            return () => {
                callbacks.delete(callback);
            }
        }
    }
}

export function renderSvelteComponent(Component: ComponentType, props: Record<string, any> = {}): [HTMLDivElement, SvelteComponent] {
    let div = document.createElement('div');
    div.style.display = "contents";

    let component = new Component({
        target: div,
        props
    });

    return [div, component];
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
        optionalLib: []
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
        isLibrary: "false"
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