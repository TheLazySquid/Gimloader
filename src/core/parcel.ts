import { log, onGimkit, splicer } from "$src/utils";
import Patcher from "$core/patcher";
import PluginManager from "./pluginManager/pluginManager.svelte";
import UI from "$core/ui/ui";

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

const scriptSelector = 'script[src*="index"]:not([nomodule])';
const redirectedPages = ['/host'];

function decachedImport(url: string) {
    return new Promise(async (res, rej) => {
        let src = new URL(url, location.origin).href;
    
        let resp = await fetch(src);
        let text = await resp.text();
    
        // nasty hack to prevent the browser from caching other scripts
        text = text.replaceAll('import(', 'window.decachedImport(');
        text = text.replaceAll('import.meta.url', `'${src}'`)
    
        let blob = new Blob([text], { type: 'application/javascript' });
        let blobUrl = URL.createObjectURL(blob);
    
        import(blobUrl)
            .then(res, rej)
            .finally(() => URL.revokeObjectURL(blobUrl));
    });
}

Object.defineProperty(unsafeWindow, "decachedImport", {
    value: decachedImport,
    writable: false,
    configurable: false
});

export default class Parcel {
    static _parcelModuleCache: Record<string, ModuleObject> = {};
    static _parcelModules: Record<string, any> = {};
    static readyToIntercept = true;
    static lazyChecks: LazyCheck[] = [];

    static init() {
        // When the page would navigate to a page that would normally break
        // navigate to a page that doesn't exist and from there set up Gimloader
        // and then load the page that would normally break
        this.getLazy(null, exports => exports?.AsyncNewTab, exports => {
            Patcher.after(null, exports, "AsyncNewTab", (_, __, returnVal) => {
                Patcher.before(null, returnVal, "openTab", (_, args) => {
                    let url = new URL(args[0]);
                    if(redirectedPages.includes(url.pathname)) {
                        args[0] = "https://www.gimkit.com/gimloaderRedirect?to=" + encodeURIComponent(args[0]);
                    }
                });
            });
        });

        if(location.pathname === "/gimloaderRedirect") {
            let params = new URLSearchParams(location.search);
            let to = params.get('to');
            this.redirect(to);
        } else if(redirectedPages.includes(location.pathname)) {
            location.href = "https://www.gimkit.com/gimloaderRedirect?to=" + encodeURIComponent(location.href);
        } else {
            let existingScripts = document.querySelectorAll(scriptSelector) as NodeListOf<HTMLScriptElement>;
            if(existingScripts.length > 0) {
                this.readyToIntercept = false;
                const run = () => {
                    this.setup();
                    this.reloadExistingScripts(existingScripts);
                }

                if(document.readyState === "complete") run();
                else window.addEventListener('load', run)
            } else {
                this.setup();
            }
        }
    }

    static async redirect(to: string) {
        let res = await fetch(to);
        let text = await res.text();

        let parser = new DOMParser();
        let doc = parser.parseFromString(text, 'text/html');

        if(document.readyState !== "complete") {
            await new Promise(resolve => window.addEventListener('load', resolve));
        }

        // redo the DOM
        this.setup();
        this.nukeDom();
        
        document.documentElement.innerHTML = doc.documentElement.innerHTML;

        UI.addCoreStyles();

        // change url back to /host
        history.replaceState(null, '', to);

        // re-import the scripts
        let existingScripts = document.querySelectorAll(scriptSelector) as NodeListOf<HTMLScriptElement>;

        this.reloadExistingScripts(existingScripts);
    }

    static emptyModules() {
        this._parcelModuleCache = {};
        this._parcelModules = {};
    }

    static async reloadExistingScripts(existingScripts: NodeListOf<HTMLScriptElement>) {
        // nuke the dom
        this.nukeDom();

        this.readyToIntercept = true;
        this.emptyModules();

        for(let existingScript of existingScripts) {
            // re-import the script since it's already loaded
            log(existingScript, 'has already loaded, re-importing...')
            
            decachedImport(existingScript.src);

            existingScript.remove();
        }
    }

    static nukeDom() {
        document.querySelector("#root")?.remove();
        let newRoot = document.createElement('div');
        newRoot.id = 'root';
        document.body.appendChild(newRoot);
        
        // remove all global variables
        let vars = ["__mobxGlobals", "__mobxInstanceCount"]
        for(let v of vars) {
            if(v in window) delete window[v];
        }
    }

    static setup() {
        if(!onGimkit) return;
        PluginManager.init();

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
                if(this.readyToIntercept) {
                    for(let i = 0; i < this.lazyChecks.length; i++) {
                        try {
                            let check = this.lazyChecks[i];
                            if(!check.matcher(moduleObject.exports, moduleName)) continue;
    
                            check.callback(moduleObject.exports);
                        } catch { continue }

                        this.lazyChecks.splice(i, 1);
                        i--;
                    }
                }
    
                return moduleObject.exports;
            }
    
            throw new Error(`Cannot find module '${moduleName}'`);
        });
        
        (requireHook as RequireHook).register = (moduleName: string, moduleCallback: any) => {
            this._parcelModules[moduleName] = moduleCallback;
        };

        Object.defineProperty(unsafeWindow, "parcelRequire388b", {
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