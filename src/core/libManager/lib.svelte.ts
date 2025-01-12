import Net from "$core/net/net";
import { log } from "$src/utils";
import { parseLibHeader } from "$src/parseHeader";
import { uuidRegex } from "$src/scopedApi";

export default class Lib {
    script: string;
    library: any;
    headers: Record<string, any> = $state();
    enabling: boolean = false;
    enableError?: Error;
    enableSuccessCallbacks: ((needsReload: boolean) => void)[] = [];
    enableFailCallbacks: ((e: any) => void)[] = [];
    usedBy = new Set<string>();
    blobUuid: string | null = null;
    onStop: (() => void)[] = [];
    
    constructor(script: string, headers?: Record<string, any>) {
        this.script = script;

        if(headers) {
            this.headers = headers;
        } else {
            this.headers = parseLibHeader(script);
        }
    }

    async enable(initial: boolean = false) {
        if(this.enableError) return Promise.reject(this.enableError);
        if(this.library) return Promise.resolve(false);

        if(!this.enabling) {
            this.enabling = true;
            let blob = new Blob([this.script], { type: 'application/javascript' });
            let url = URL.createObjectURL(blob);
            this.blobUuid = url.match(uuidRegex)?.[0];
    
            import(url)
                .then((returnVal) => {
                    if(returnVal.onStop && typeof returnVal.onStop === "function") {
                        this.onStop.push(returnVal.onStop);
                    }

                    if(returnVal.default) {
                        returnVal = returnVal.default;
                    }

                    let needsReload = this.headers.reloadRequired === 'true' || 
                        this.headers.reloadRequired === '' ||
                        (this.headers.reloadRequired === 'ingame' && Net.type !== "None");
            
                    this.library = Object.freeze(returnVal);
                    this.enableSuccessCallbacks.forEach(cb => cb(!initial && needsReload));
                })
                .catch((e) => {
                    let error = new Error(`Failed to enable library ${this.headers.name}:\n${e}`)
                    this.enableError = error;
                    this.enableFailCallbacks.forEach(cb => cb(error));
                })
                .finally(() => {
                    URL.revokeObjectURL(url);
                })
        }

        return new Promise<boolean>((res, rej) => {
            this.enableSuccessCallbacks.push(res);
            this.enableFailCallbacks.push(rej);
        });
    }

    addUsed(pluginName: string) {
        this.usedBy.add(pluginName);
    }

    removeUsed(pluginName: string) {
        this.usedBy.delete(pluginName);
    
        if(this.usedBy.size === 0) {
            this.disable();
        }
    }

    disable() {
        // call onStop if it exists
        try {
            for(let stop of this.onStop) stop();
        } catch(e) {
            log(`Error stopping library ${this.headers.name}:`, e);
        }
        this.onStop = [];

        // reset the library
        this.library = null;
        this.enableError = undefined;
        this.enabling = false;
        this.enableSuccessCallbacks = [];
        this.enableFailCallbacks = [];
    }
}