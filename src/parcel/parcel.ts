/*
    This method of intercepting modules was inspired by https://codeberg.org/gimhook/gimhook
*/

import { getUnsafeWindow, log } from "../util";

// the code below is copied from https://codeberg.org/gimhook/gimhook/src/branch/master/modloader/src/parcel.ts,
// who in turn copied it from the parcel source code.

export default class Parcel {
    _parcelModuleCache = {};
    _parcelModules = {};
    reqIntercepts: { match: (exports: any) => boolean, callback: (exports: any) => any }[] = [];
    // regIntercepts: { match: string | RegExp, callback: (exports: any) => any }[] = [];

    constructor() {
        this.setup();
        this.reloadExistingScript();
    }

    interceptRequire(match: (exports: any) => boolean, callback: (exports: any) => any) {
        this.reqIntercepts.push({ match, callback });
    }
    
    // interceptRegister(match: string | RegExp, callback: (exports: any) => any) {
    //     this.regIntercepts.push({ match, callback });
    // }

    async reloadExistingScript() {
        let existingScript = document.querySelector('script[src*="index"]') as HTMLScriptElement;
        if(existingScript) {
            // re-import the script since it's already loaded
            log('The script has already loaded, re-importing...')
    
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
                for (let intercept of this.reqIntercepts) {
                    if (intercept.match(moduleObject.exports)) {
                        let returned = intercept.callback(moduleObject.exports);
                        if(returned) moduleObject.exports = returned;
                    }
                }
    
                return moduleObject.exports;
            }
    
            throw new Error(`Cannot find module '${moduleName}'`);
        }
        // @ts-ignore
        ).register = (moduleName, moduleCallback) => {
            this._parcelModules[moduleName] = moduleCallback;
            
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