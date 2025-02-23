export function fixRDT() {
    if(!makeHookUnenumerable()) {
        setTimeout(makeHookUnenumerable);
    }
}

function makeHookUnenumerable() {
    const hook = (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__;
    if(!hook) return false;
    
    for(let key in hook) {
        Object.defineProperty(hook, key, {
            enumerable: false
        });
    }

    return true;
}