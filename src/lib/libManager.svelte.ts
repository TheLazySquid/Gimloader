import { confirmLibReload, parseLibHeader } from '$src/util';
import Lib from './lib';
import debounce from 'debounce';
import type { Gimloader } from '$src/gimloader.svelte';

// The only reason this is done this way is because I really want to have lib() and lib.get() to be the same function
// If there is a better way to do this please let me know
export class LibManagerClass {
    libs: Lib[] = $state();
    gimloader: Gimloader;

    constructor(gimloader: Gimloader) {
        let libScripts = GM_getValue('libs', []) as string[];

        let libs = [];
        // convert from the old, unordered version
        if(!Array.isArray(libScripts)) {
            libScripts = Object.values(libScripts);
        }
    
        for(let script of libScripts) {
            let lib = new Lib(gimloader, script);
    
            libs.push(lib);
        }
        this.libs = libs;

        this.gimloader = gimloader;
    }

    getLib(libName: string): Lib {
        return this.libs.find((lib: Lib) => lib.headers.name === libName);
    }

    saveFn() {
        if((window as any).destroyed) return;

        let libStrs: string[] = [];
        for(let lib of this.libs) {
            libStrs.push(lib.script);
        }

        GM_setValue('libs', libStrs);
    }

    saveDebounced?: () => void;
    save() {
        if(!this.saveDebounced) this.saveDebounced = debounce(this.saveFn, 100);

        this.saveDebounced();
    }

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
        this.libs.unshift(lib);

        this.save();

        return lib;
    }

    deleteLib(lib: Lib) {
        lib.disable();
        this.libs.splice(this.libs.indexOf(lib), 1);

        this.save();
    }

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

    wipe() {
        for(let lib of this.libs) {
            lib.disable();
        }

        this.libs = [];
        this.saveFn();
    }
}

export type GetLibType = (lib: string) => any;
export interface LibType extends GetLibType {
    get: GetLibType;
    getLib: (libName: string) => Lib;
};

function makeLibManager(gimloader: Gimloader): [LibType, LibManagerClass] {
    const libManager = new LibManagerClass(gimloader);

    const get = function(libName: string) {
        let lib = libManager.libs.find(lib => lib.headers.name === libName);
        return lib?.library ?? null;
    }
    
    const lib: LibType = get as LibType;

    Object.assign(lib, {
        get,
        getLib: (name: string) => libManager.getLib(name)
    });

    GM_addValueChangeListener('libs', (_, __, value: string[], remote) => {
        if(!remote) return;
        let newLibs: Lib[] = [];

        for(let script of value) {
            let lib = new Lib(this.gimloader, script);
            newLibs.push(lib);
        }

        // check if any libraries were removed
        for(let checkLib of libManager.libs) {
            if(!newLibs.some(newLib => newLib.headers.name === checkLib.headers.name)) {
                libManager.deleteLib(checkLib);
            }
        }

        // check if any libraries were added
        for(let newLib of newLibs) {
            if(!libManager.libs.some(lib => lib.headers.name === newLib.headers.name)) {
                libManager.createLib(newLib.script, newLib.headers, true);
            }
        }

        // check if any libraries were updated
        for(let newLib of newLibs) {
            let existing = libManager.libs.find(lib => lib.headers.name === newLib.headers.name);
            if(existing.script !== newLib.script) {
                libManager.editLib(existing, newLib.script, newLib.headers);
            }
        }

        // move the libraries into the correct order
        let newOrder = [];
        for (let newLib of newLibs) {
            let setLib = lib.getLib(newLib.headers.name);
            if (setLib) newOrder.push(setLib);
        }

        libManager.libs = newOrder;
    })

    return [lib, libManager];
}

export default makeLibManager;