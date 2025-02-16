import { parseLibHeader } from '$shared/parseHeader';
import Lib from './lib.svelte';
import type { LibraryInfo } from '$types/state';
import Port from '$shared/port.svelte';
import { confirmLibReload } from '$content/utils';
import toast from 'svelte-5-french-toast';

export default new class LibManagerClass {
    libs: Lib[] = $state([]);

    init(libInfo: LibraryInfo[]) {
        for(let info of libInfo) {
            let lib = new Lib(info.script);
    
            this.libs.push(lib);
        }

        Port.on("libraryEdit", ({ name, script }) => this.editLibrary(name, script, false));
        Port.on("libraryDelete", ({ name }) => this.deleteLib(this.getLib(name), false));
        Port.on("librariesDeleteAll", () => this.deleteAll());
        Port.on("libraryCreate", ({ script }) => this.createLib(script, true, false));
        Port.on("librariesArrange", ({ order }) => this.arrangeLibs(order, false));
    }

    get(libName: string) {
        let lib = this.libs.find(lib => lib.headers.name === libName);
        return lib?.library ?? null;
    }

    getLib(libName: string): Lib {
        return this.libs.find((lib: Lib) => lib.headers.name === libName);
    }

    createLib(script: string, ignoreDuplicates = false, emit = true) {
        let headers = parseLibHeader(script);
        
        if(headers.isLibrary === "false") {
            toast.error("That script doesn't appear to be a library! If it should be, please set the isLibrary header, and if not, please import it as a plugin.");
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

        if(emit) Port.send("libraryCreate", { script, name: headers.name });

        return lib;
    }

    deleteLib(lib: Lib, emit = true) {
        if(!lib) return;
        lib.disable();
        this.libs.splice(this.libs.indexOf(lib), 1);

        if(emit) Port.send("libraryDelete", { name: lib.headers.name });
    }

    deleteAll(emit = true) {
        for(let lib of this.libs) {
            lib.disable();
        }

        this.libs = [];

        if(emit) Port.send("librariesDeleteAll");
    }

    getLibHeaders(name: string) {
        let lib = this.getLib(name);
        if(!lib) return null;
        return $state.snapshot(lib.headers);
    }

    isEnabled(name: string) {
        let lib = this.getLib(name);
        if(!lib) return null;
        return lib.enablePromise !== null;
    }

    getLibNames(): string[] {
        return this.libs.map(lib => lib.headers.name);
    }

    async editLibrary(library: Lib | string, script: string, emit = true) {
        let lib = typeof library === "string" ? this.getLib(library) : library;
        if(!lib) return;

        let headers = parseLibHeader(script);
        if(emit) Port.send("libraryEdit", { name: lib.headers.name, script, newName: headers.name });

        if(lib.headers.name === headers.name) {
            if(lib.usedBy.size > 0) {
                lib.disable();
                lib.script = script;

                let needsReload = await lib.enable();
                if(needsReload) {
                    if(confirmLibReload([lib])) location.reload();
                }
            } else{
                lib.script = script;
            }
        } else {
            lib.usedBy.clear();
            lib.disable();
            lib.script = script;
        }

        lib.headers = headers;
    }

    arrangeLibs(order: string[], emit = true) {
        let newOrder = [];

        for (let name of order) {
            let lib = this.getLib(name);
            if (lib) newOrder.push(lib);
        }
        this.libs = newOrder;

        if(emit) Port.send("librariesArrange", { order });
    }
}