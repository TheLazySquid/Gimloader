/*
    This method of intercepting modules was inspired by https://codeberg.org/gimhook/gimhook
*/

import { getUnsafeWindow, log } from "../util";

// the code below is copied from https://codeberg.org/gimhook/gimhook/src/branch/master/modloader/src/parcel.ts,
// who in turn copied it from the parcel source code.

type Intercept = { id?: string, match: (exports: any) => boolean, callback: (exports: any) => any, once: boolean };

export default class Parcel extends EventTarget {
    _parcelModuleCache = {};
    _parcelModules = {};
    reqIntercepts: Intercept[] = [];
    readyToIntercept = true;
    // regIntercepts: { match: string | RegExp, callback: (exports: any) => any }[] = [];

    constructor() {
        super();

        window.addEventListener('load', () => {
            this.setup();
            this.reloadExistingScript();
        })
    }

    interceptRequire(id: string | null, match: (exports: any) => boolean, callback: (exports: any) => any, once: boolean = false) {
        if(!match || !callback) throw new Error('match and callback are required');
        let intercept: Intercept = { match, callback, once };
        if(id) intercept.id = id;
        this.reqIntercepts.push(intercept);

        // return a cancel function
        return () => {
            let index = this.reqIntercepts.indexOf(intercept);
            if(index !== -1) this.reqIntercepts.splice(index, 1);
        }
    }

    stopIntercepts(id: string) {
        this.reqIntercepts = this.reqIntercepts.filter(intercept => intercept.id !== id);
    }

    async decachedImport(url: string) {
        let src = new URL(url, location.origin).href;

        let res = await fetch(src);
        let text = await res.text();

        // nasty hack to prevent the browser from caching other scripts
        text = text.replaceAll('import(', 'window.GL.parcel.decachedImport(');
        text = text.replaceAll('import.meta.url', `'${src}'`)

        let blob = new Blob([text], { type: 'application/javascript' });
        let blobUrl = URL.createObjectURL(blob);

        return import(blobUrl);
    }

    async reloadExistingScript() {
        let existingScripts = document.querySelectorAll('script[src*="index"]:not([nomodule])') as NodeListOf<HTMLScriptElement>;
        if(existingScripts.length > 0) this.readyToIntercept = false;
        else return;

        // nuke the dom
        document.querySelector("#root")?.remove();
        let newRoot = document.createElement('div');
        newRoot.id = 'root';
        document.body.appendChild(newRoot);
        
        this.readyToIntercept = true;
        this._parcelModuleCache = {};
        this._parcelModules = {};

        for(let existingScript of existingScripts) {
            // re-import the script since it's already loaded
            log(existingScript, 'has already loaded, re-importing...')
            
            this.decachedImport(existingScript.src);

            existingScript.remove();
        }
    }

    setup() {
        let requireHook: (moduleName: string) => void;
        let nativeParcelRequire = getUnsafeWindow()["parcelRequire388b"];
    
        ((requireHook = (moduleName) => {
            if (moduleName in this._parcelModuleCache) {
                return this._parcelModuleCache[moduleName].exports;
            }
    
            if (moduleName in this._parcelModules) {
                let moduleCallback = this._parcelModules[moduleName];
                delete this._parcelModules[moduleName];
    
                let moduleObject = {
                    id: moduleName,
                    exports: {} as any
                };
    
                this._parcelModuleCache[moduleName] = moduleObject;
    
                moduleCallback.call(moduleObject.exports, moduleObject, moduleObject.exports);

                // run intercepts
                if(this.readyToIntercept) {
                    for (let intercept of this.reqIntercepts) {
                        if (intercept.match(moduleObject.exports)) {
                            let returned = intercept.callback?.(moduleObject.exports);
                            if(returned) moduleObject.exports = returned;
    
                            if(intercept.once) {
                                this.reqIntercepts.splice(this.reqIntercepts.indexOf(intercept), 1);
                            }
                        }
                    }
                }
    
                return moduleObject.exports;
            }
    
            if(nativeParcelRequire) {
                return nativeParcelRequire(moduleName);
            }

            throw new Error(`Cannot find module '${moduleName}'`);
        }
        // @ts-ignore
        ).register = (moduleName, moduleCallback) => {
            this._parcelModules[moduleName] = moduleCallback;
            nativeParcelRequire?.register(moduleName, moduleCallback);
        });

        Object.defineProperty(getUnsafeWindow(), "parcelRequire388b", {
            value: requireHook,
            writable: false,
            enumerable: true,
            configurable: false
        });
    }
}