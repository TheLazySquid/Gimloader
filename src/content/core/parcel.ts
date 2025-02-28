import { splicer } from "$content/utils";

type RequireHookFn = (moduleName: string) => void;

interface RequireHook extends RequireHookFn {
    register: (moduleName: string, moduleCallback: any) => void;
}

interface ModuleObject {
    id: string;
    exports: any;
}

/** @inline */
export type Matcher = (exports: any, id: string) => boolean;

interface LazyCheck {
    id: string;
    matcher: Matcher;
    callback: (exports: any) => any;
}

export default class Parcel {
    static _parcelModuleCache: Record<string, ModuleObject> = {};
    static _parcelModules: Record<string, any> = {};
    static lazyChecks: LazyCheck[] = [];

    static init() {
        let requireHook = ((moduleName: string) => {
            if (moduleName in this._parcelModuleCache) {
                return this._parcelModuleCache[moduleName].exports;
            }
    
            if (moduleName in this._parcelModules) {
                let moduleCallback = this._parcelModules[moduleName];
                delete this._parcelModules[moduleName];
    
                let moduleObject: any = {
                    id: moduleName,
                    exports: {}
                };
    
                this._parcelModuleCache[moduleName] = moduleObject;
    
                moduleCallback.call(moduleObject.exports, moduleObject, moduleObject.exports);

                // run intercepts
                for(let i = 0; i < this.lazyChecks.length; i++) {
                    try {
                        let check = this.lazyChecks[i];
                        if(!check.matcher(moduleObject.exports, moduleName)) continue;

                        check.callback(moduleObject.exports);
                    } catch { continue }

                    this.lazyChecks.splice(i, 1);
                    i--;
                }
    
                return moduleObject.exports;
            }
    
            throw new Error(`Cannot find module '${moduleName}'`);
        });
        
        (requireHook as RequireHook).register = (moduleName: string, moduleCallback: any) => {
            this._parcelModules[moduleName] = moduleCallback;
        };

        Object.defineProperty(window, "parcelRequire388b", {
            value: requireHook,
            writable: false,
            configurable: false
        });
    }

    static query(matcher: Matcher, multiple: boolean = false) {
        let modules = [];

        for(let id in this._parcelModuleCache) {
            let exports = this._parcelModuleCache[id].exports;
            if(matcher(exports, id)) {
                if(!multiple) return exports;
                modules.push(exports);
            }
        }

        if(!multiple) return null;
        return modules;
    }

    static getLazy(id: string | null, matcher: Matcher, callback: (exports: any) => any, initial = true) {
        if(initial) {
            let module = this.query(matcher, false);
            if(module) {
                callback(module);
                return () => {}
            }
        }

        let obj = { id, matcher, callback };
        this.lazyChecks.push(obj);

        return splicer(this.lazyChecks, obj);
    }

    static stopLazy(id: string) {
        for(let i = 0; i < this.lazyChecks.length; i++) {
            if(this.lazyChecks[i].id === id) {
                this.lazyChecks.splice(i, 1);
                i--;
            }
        }
    }
}