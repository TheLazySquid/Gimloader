import { parseLibHeader } from '$src/parseHeader';
import { confirmLibReload } from '$src/utils';
import Storage from '$core/storage';
import Lib from './lib.svelte';
import debounce from 'debounce';

// The only reason this is done this way is because I really want to have lib() and lib.get() to be the same function
// If there is a better way to do this please let me know
export class LibManagerClass {
    libs: Lib[] = $state();
    destroyed = false;

    constructor() {
        let libScripts = Storage.getValue('libs', []) as string[];

        let libs = [];

        // convert from the old, unordered version
        if(!Array.isArray(libScripts)) {
            libScripts = Object.values(libScripts);
        }
    
        for(let script of libScripts) {
            let lib = new Lib(script);
    
            libs.push(lib);
        }
        this.libs = libs;

        GM_addValueChangeListener('libs', (_, __, value: string[], remote) => {
            if(!remote) return;
            let newLibs: Lib[] = [];
    
            for(let script of value) {
                let lib = new Lib(script);
                newLibs.push(lib);
            }
    
            // check if any libraries were removed
            for(let checkLib of this.libs) {
                if(!newLibs.some(newLib => newLib.headers.name === checkLib.headers.name)) {
                    this.deleteLib(checkLib);
                }
            }
    
            // check if any libraries were added
            for(let newLib of newLibs) {
                if(!this.libs.some(lib => lib.headers.name === newLib.headers.name)) {
                    this.createLib(newLib.script, newLib.headers, true);
                }
            }
    
            // check if any libraries were updated
            for(let newLib of newLibs) {
                let existing = this.libs.find(lib => lib.headers.name === newLib.headers.name);
                if(existing.script !== newLib.script) {
                    this.editLib(existing, newLib.script, newLib.headers);
                }
            }
    
            // move the libraries into the correct order
            let newOrder = [];
            for (let newLib of newLibs) {
                let setLib = this.getLib(newLib.headers.name);
                if (setLib) newOrder.push(setLib);
            }
    
            this.libs = newOrder;
        });
    }

    get(libName: string) {
        let lib = this.libs.find(lib => lib.headers.name === libName);
        return lib?.library ?? null;
    }

    getLib(libName: string): Lib {
        return this.libs.find((lib: Lib) => lib.headers.name === libName);
    }

    saveFn() {
        if(this.destroyed) return;
        
        let libStrs: string[] = [];
        for(let lib of this.libs) {
            libStrs.push(lib.script);
        }

        Storage.setValue('libs', libStrs);
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

        let lib = new Lib(script, headers);
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

    getLibHeaders(name: string) {
        let lib = this.getLib(name);
        if(!lib) return null;
        return $state.snapshot(lib.headers);
    }

    isEnabled(name: string) {
        let lib = this.getLib(name);
        if(!lib) return null;
        return lib.enabling;
    }

    getLibNames(): string[] {
        return this.libs.map(lib => lib.headers.name);
    }
}

const libManager = new LibManagerClass();
export default libManager;