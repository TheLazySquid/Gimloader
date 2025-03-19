import type { State } from "$types/state";
import type { OnceMessages, OnceResponses, StateMessages } from "$types/messages";
import { saveDebounced } from "$bg/state";
import Server from "$bg/server";
import { formatDownloadUrl } from "$shared/net";

interface MissingLib {
    name: string;
    url?: string;
}

export default class LibrariesHandler {
    static init() {
        Server.on("libraryEdit", this.onLibraryEdit.bind(this));
        Server.on("libraryDelete", this.onLibraryDelete.bind(this));
        Server.on("librariesDeleteAll", this.onLibrariesDeleteAll.bind(this));
        Server.on("libraryCreate", this.onLibraryCreate.bind(this));
        Server.on("librariesArrange", this.onLibrariesArrange.bind(this));

        Server.onMessage("downloadLibraries", this.downloadLibraries.bind(this));
    }

    static save() {
        saveDebounced('libraries');
    }

    static onLibraryEdit(state: State, message: StateMessages["libraryEdit"]) {
        let lib = state.libraries.find((lib) => lib.name === message.name);
        lib.script = message.script;
        lib.name = message.newName;
        this.save();
    }

    static onLibraryDelete(state: State, message: StateMessages["libraryDelete"]) {
        state.libraries = state.libraries.filter((lib => lib.name !== message.name));
        this.save();
    }

    static onLibrariesDeleteAll(state: State) {
        state.libraries = [];
        this.save();
    }

    static onLibraryCreate(state: State, message: StateMessages["libraryCreate"]) {
        state.libraries.unshift({
            name: message.name,
            script: message.script
        });
        this.save();
    }

    static onLibrariesArrange(state: State, message: StateMessages["librariesArrange"]) {
        let newLibraries = [];
        for(let name of message.order) {
            let lib = state.libraries.find((lib) => lib.name === name);
            newLibraries.push(lib);
        }
        state.libraries = newLibraries;
        this.save();
    }

    static async downloadLibraries(state: State, message: OnceMessages["downloadLibraries"],
        reply: (response: OnceResponses["downloadLibraries"]) => void) {
        let missing: MissingLib[] = [];
    
        for(let lib of message.libraries) {
            let parts = lib.split('|');
            let name = parts[0].trim();
            let url = parts[1]?.trim();
    
            if(state.libraries.some(l => l.name === name)) continue;    
            missing.push({ name, url });
        }
    
        if(missing.length === 0) return reply({ allDownloaded: true });
    
        // attempt to download ones with a url
        let downloadable = missing.filter(m => m.url);
        let results = await Promise.allSettled(downloadable.map(({ name, url }) => {
            return new Promise<string>(async (res, rej) => {
                let resp = await fetch(formatDownloadUrl(url))
                    .catch(() => rej(`Failed to download library ${name} from ${url}`));
                if(!resp) return;
                if(resp.status !== 200) return rej(`Failed to download library ${name} from ${url}\nRecieved response status of ${resp.status}`);

                let text = await resp.text();
                res(text);
            });
        }));
    
        // create the libraries that successfully were returned
        for(let i = 0; i < results.length; i++) {
            let res = results[i];
            if(res.status !== "fulfilled") continue;
            
            let message = { name: downloadable[i].name, script: res.value };
            this.onLibraryCreate(state, message);
            Server.send("libraryCreate", message);
        }
    
        // return any errors that happened
        let failed = results.filter(r => r.status === 'rejected') as PromiseRejectedResult[];
        if(failed.length > 0) {
            let msg = failed.map(f => f.reason).join('\n');
            return reply({ allDownloaded: false, error: msg });
        }

        reply({ allDownloaded: missing.length === downloadable.length });
    }
}