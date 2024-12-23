import { confirmLibReload, easyAccessWritable, parseLibHeader } from '$src/util';
import Lib from './lib';
import type { EasyAccessWritable } from '$src/types';
import debounce from 'debounce';
import type { Gimloader } from '$src/gimloader';

// The only reason this is done this way is because I really want to have lib() and lib.get() to be the same function
// If there is a better way to do this please let me know
const libManagerMethods = {
    getLib(libName: string): Lib {
        return this.libs.value.find((lib: Lib) => lib.headers.name === libName);
    },
    saveFn() {
        let libStrs: string[] = [];
        for(let lib of this.libs.value) {
            libStrs.push(lib.script);
        }

        GM_setValue('libs', libStrs);

    },
    save(libs?: Record<string, string>) {
        if(libs) this.libs.value = libs;
        if(!this.saveDebounced) this.saveDebounced = debounce(this.saveFn, 100);

        this.saveDebounced();
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
            this.deleteLib(existing);
        }

        let lib = new Lib(this.gimloader, script, headers);
        this.libs.value.unshift(lib);

        this.save();
        this.libs.update();

        return lib;
    },
    deleteLib(lib: Lib) {
        lib.disable();
        this.libs.value.splice(this.libs.value.indexOf(lib), 1);

        this.save();
        this.libs.update();
    },
    async editLib(lib: Lib, code: string, headers?: Record<string, any>) {
        headers = headers ?? parseLibHeader(code);

        if(lib.headers.name === headers.name) {
            let newLib = this.createLib(code, headers, true);
            if(newLib) {
                newLib.usedBy = lib.usedBy;
                if(newLib.usedBy.size == 0) return;
                let needsReload = await newLib.enable();
                if(!needsReload) return;

                let reload = confirmLibReload([lib]);
                if(!reload) return;

                this.saveFn();
                location.reload();
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
    libs: EasyAccessWritable<Lib[]>;
};
type additionalValuesType = typeof libManagerMethods;
export interface LibManagerType extends LibManagerBase, additionalValuesType {};

function makeLibManager(gimloader: Gimloader) {
    let libScripts = GM_getValue('libs', []) as string[];

    // convert from the old, unordered version
    if(!Array.isArray(libScripts)) {
        libScripts = Object.values(libScripts);
    }

    let libs = easyAccessWritable<Lib[]>([]);

    for(let script of libScripts) {
        let lib = new Lib(gimloader, script);

        libs.value.push(lib);
    }

    libs.update();

    const get = function(libName: string) {
        let lib = libs.value.find(lib => lib.headers.name === libName);
        return lib?.library ?? null;
    }
    
    const lib: LibManagerType = get as LibManagerType;
    Object.assign(lib, {
        gimloader,
        get,
        libs
    }, libManagerMethods);

    GM_addValueChangeListener('libs', (_, __, value: string[], remote) => {
        if(!remote) return;
        let newLibs: Lib[] = [];

        for(let script of value) {
            let lib = new Lib(this.gimloader, script);
            newLibs.push(lib);
        }

        // check if any libraries were removed
        for(let checkLib of libs.value) {
            if(!newLibs.some(newLib => newLib.headers.name === checkLib.headers.name)) {
                lib.deleteLib(checkLib);
            }
        }

        // check if any libraries were added
        for(let newLib of newLibs) {
            if(!libs.value.some(lib => lib.headers.name === newLib.headers.name)) {
                lib.createLib(newLib.script, newLib.headers, true);
            }
        }

        // check if any libraries were updated
        for(let newLib of newLibs) {
            let existing = libs.value.find(lib => lib.headers.name === newLib.headers.name);
            if(existing.script !== newLib.script) {
                lib.editLib(existing, newLib.script, newLib.headers);
            }
        }

        // move the libraries into the correct order
        let newOrder = [];
        for (let newLib of newLibs) {
            let setLib = lib.getLib(newLib.headers.name);
            if (setLib) newOrder.push(setLib);
        }

        lib.libs.set(newOrder);
    })

    return lib;
}

export default makeLibManager;