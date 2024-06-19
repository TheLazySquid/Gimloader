import { log, parseLibHeader } from "../util";

export default class Lib {
    script: string;
    library: any;
    headers: Record<string, any> = {};
    enabling: boolean = false;
    enableError?: Error;
    enableSuccessCallbacks: (() => void)[] = [];
    enableFailCallbacks: ((e: any) => void)[] = [];
    usedBy = new Set<string>();
    
    constructor(script: string, headers?: Record<string, any>) {
        this.script = script;

        if(headers) {
            this.headers = headers;
        } else {
            this.headers = parseLibHeader(script);
        }
    }

    async enable() {
        if(this.enableError) return Promise.reject(this.enableError);
        if(this.library) return Promise.resolve();

        if(!this.enabling) {
            this.enabling = true;
            let blob = new Blob([this.script], { type: 'application/javascript' });
            let url = URL.createObjectURL(blob);
    
            import(url)
                .then((returnVal) => {
                    if(returnVal.default) {
                        returnVal = returnVal.default;
                    }
            
                    this.library = returnVal;
                    this.enableSuccessCallbacks.forEach(cb => cb());
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

        return new Promise<void>((res, rej) => {
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
            this.library?.onStop?.();
        } catch(e) {
            log(`Error stopping library ${this.headers.name}:`, e);
        }

        // reset the library
        this.library = null;
        this.enableError = undefined;
        this.enabling = false;
        this.enableSuccessCallbacks = [];
        this.enableFailCallbacks = [];
    }
}