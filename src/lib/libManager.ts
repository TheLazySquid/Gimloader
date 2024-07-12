import { parseLibHeader } from '$src/util';
import Lib from './lib';

// The only reason this is done this way is because I really want to have lib() and lib.get() to be the same function
// If there is a better way to do this please let me know
const libManagerMethods = {
    getLib(libName: string): Lib {
        return this.libs[libName];
    },
    updateReact() {
        if(this.updateLibTimeout) clearTimeout(this.updateLibTimeout);

        this.updateLibTimeout = setTimeout(() => {
            this.reactSetLibs?.({...this.libs});
        });
    },
    save(libs?: Record<string, string>) {
        if(libs) this.libs = libs;

        let libObjs = {};
        for(let name in this.libs) {
            libObjs[name] = this.libs[name].script;
        }

        GM_setValue('libs', libObjs);
    },
    createLib(script: string, headers?: Record<string, any>, ignoreDuplicates?: boolean) {
        headers = headers ?? parseLibHeader(script);
        
        if(headers.isLibrary === "false") {
            alert("That script doesn't appear to be a library! If it should be, please set the isLibrary header, and if not, please import it as a plugin.");
            return;
        }

        let existing = this.getLib(headers.name);
        if(existing && !ignoreDuplicates) {
            let conf = confirm(`A library named ${headers.name} already exists! Do you want to overwrite it?`);
            if(!conf) return;
        }

        if(existing) {
            existing.disable();
        }

        let lib = new Lib(script, headers);
        this.libs[lib.headers.name] = lib;

        this.save();
        this.updateReact();

        return lib;
    },
    deleteLib(lib: Lib) {
        lib.disable();
        delete this.libs[lib.headers.name];

        this.save();
        this.updateReact();
    },
    editLib(lib: Lib, code: string, headers?: Record<string, any>) {
        headers = headers ?? parseLibHeader(code);

        if(lib.headers.name === headers.name) {
            let newLib = this.createLib(code, headers, true);
            if(newLib) {
                newLib.usedBy = lib.usedBy;
                if(newLib.usedBy.size > 0) newLib.enable();
            }
        } else {
            let wentThrough = this.createLib(code, headers);
            if(wentThrough) {
                this.deleteLib(lib);
            }
        }
    }
}

export type GetLibType = (lib: string) => any;
export interface LibManagerBase extends GetLibType {
    get: GetLibType;
    libs: Record<string, Lib>;
    reactSetLibs?: (libs: Record<string, Lib>) => void;
    updateLibTimeout: any;
};
type additionalValuesType = typeof libManagerMethods;
export interface LibManagerType extends LibManagerBase, additionalValuesType {};

function makeLibManager() {
    let libScripts = GM_getValue('libs', {}) as Record<string, string>;
    let libs: Record<string, Lib> = {};

    for(let name in libScripts) {
        let script = libScripts[name];
        let lib = new Lib(script);

        libs[name] = lib;
    }

    const get = function(libName: string) {
        let lib = libs[libName];
        return lib?.library ?? null;
    }
    
    const lib: LibManagerType = get as LibManagerType;
    Object.assign(lib, {
        get,
        libs
    }, libManagerMethods);

    GM_addValueChangeListener('libs', (_, __, value: Record<string, string>, remote) => {
        if(!remote) return;
        let newLibs: Record<string, Lib> = {};

        for(let name in value) {
            let script = value[name];
            let lib = new Lib(script);

            newLibs[name] = lib;
        }

        // check if any plugins were removed
        for(let name in libs) {
            if(!newLibs[name]) {
                lib.deleteLib(libs[name]);
            }
        }

        // check if any scripts were added
        for(let name in newLibs) {
            if(!libs[name]) {
                lib.createLib(newLibs[name].script, newLibs[name].headers, true);
            }
        }

        // check if any scripts were updated
        for(let name in newLibs) {
            if(libs[name].script !== newLibs[name].script) {
                lib.editLib(libs[name], newLibs[name].script, newLibs[name].headers);
            }
        }

        lib.updateReact();
    })

    return lib;
}

export default makeLibManager;