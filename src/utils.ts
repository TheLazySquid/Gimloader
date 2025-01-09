import type Lib from "$core/libManager/lib";

export function log(...args: any[]) {
    console.log('%c[GL]', 'color:#5030f2', ...args);
}

export function error(...args: any[]) {
    console.error('%c[GL]', 'color:#5030f2', ...args);
}

export function validate(fnName: string, args: IArguments, ...schema: [string, string | object][]) {
    for(let i = 0; i < schema.length; i++) {
        let [ name, type ] = schema[i];

        // check whether the key argument is present
        if(args[i] === undefined) {
            error(fnName, 'called without argument', name);
            return false;
        }
        if(type === "any") continue;

        if(typeof type === "object") {
            if(typeof args[i] !== "object") {
                error(fnName, 'recieved', args[i], `for argument ${name}, expected type object`);
                return false;
            }

            for(let key in type) {
                if(args[i][key] === undefined) {
                    error(fnName, `called without argument ${name}.${key}`);
                    return false;
                }

                if(typeof args[i][key] !== type[key]) {
                    error(fnName, 'recieved', args[i][key], `for argument ${name}.${key}, expected type ${type[key]}`);
                }
            }
        } else {
            if(typeof args[i] !== type) {
                error(fnName, 'recieved', args[i], `for argument ${name}, expected type ${type}`);
                return false;
            }
        }
    }

    return true;
}

export const onGimkit = location.host === "www.gimkit.com";

export function splicer(array: any[], obj: any) {
    return () => {
        let index = array.indexOf(obj);
        if(index !== -1) array.splice(index, 1);
    }
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