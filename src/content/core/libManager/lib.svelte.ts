import Net from "$content/core/net/net";
import { log } from "$content/utils";
import { parseLibHeader } from "$content/parseHeader";
import { uuidRegex } from "$content/scopedApi";

export default class Lib {
    script: string;
    library: any;
    headers: Record<string, any> = $state();
    usedBy = new Set<string>();
    blobUuid: string | null = null;
    onStop: (() => void)[] = [];
    enablePromise: Promise<boolean> | null = null;
    
    constructor(script: string, headers?: Record<string, any>) {
        this.script = script;

        if(headers) {
            this.headers = headers;
        } else {
            this.headers = parseLibHeader(script);
        }
    }

    enable(initial: boolean = false) {
        if(this.enablePromise) return this.enablePromise;

        this.enablePromise = new Promise((res, rej) => {
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
            
                    this.library = returnVal;
                    res(!initial && needsReload);
                })
                .catch((e) => {
                    let error = new Error(`Failed to enable library ${this.headers.name}:\n${e}`)
                    rej(error);
                })
                .finally(() => {
                    URL.revokeObjectURL(url);
                });
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
        this.enablePromise = null;
    }
}