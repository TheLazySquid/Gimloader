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

        this.setup();
        this.reloadExistingScript();
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
    
    // interceptRegister(match: string | RegExp, callback: (exports: any) => any) {
    //     this.regIntercepts.push({ match, callback });
    // }

    async reloadExistingScript() {
        let existingScripts = document.querySelectorAll('script[src*="index"]:not([nomodule])') as NodeListOf<HTMLScriptElement>;
        if(existingScripts.length > 0) this.readyToIntercept = false;
        else return;

        await new Promise(res => window.addEventListener('load', res));

        // nuke the dom
        document.querySelector("#root")?.remove();
        let newRoot = document.createElement('div');
        newRoot.id = 'root';
        document.body.appendChild(newRoot);
        
        this.readyToIntercept = true;

        for(let existingScript of existingScripts) {
            // re-import the script since it's already loaded
            log(existingScript, 'has already loaded, re-importing...')
    
            let res = await fetch(existingScript.src);
            let text = await res.text();
        
            let script = document.createElement('script');
            script.textContent = text;
            script.type = "module";
            document.head.appendChild(script);

            existingScript.remove();
        }
    }

    setup() {
        let requireHook: (moduleName: string) => void;
    
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
    
            throw new Error(`Cannot find module '${moduleName}'`);
        }
        // @ts-ignore
        ).register = (moduleName, moduleCallback) => {
            this._parcelModules[moduleName] = moduleCallback;

            // remove it from the cache if it's already been loaded
            if (moduleName in this._parcelModuleCache) {
                delete this._parcelModuleCache[moduleName];
            }
            
            // this is really the only way to tell functions apart without evaluating them
            // let str = moduleCallback.toString();
            // for(let intercept of this.regIntercepts) {
            //     if(intercept.match instanceof RegExp) {
            //         if(intercept.match.test(str)) {
            //             intercept.callback(moduleCallback);
            //         }
            //     } else {
            //         if(str.includes(intercept.match)) {
            //             intercept.callback(moduleCallback);
            //         }
            //     }
            // }
        });

        Object.defineProperty(getUnsafeWindow(), "parcelRequire388b", {
            value: requireHook,
            writable: false,
            enumerable: true,
            configurable: false
        });
    }
}