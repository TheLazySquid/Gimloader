// gotta have pretty console.logs
export function log(...args: any[]) {
    console.log('%c[GL]', 'color:#5030f2', ...args);
}

export function getUnsafeWindow() {
    if (typeof unsafeWindow !== "undefined") return unsafeWindow;
    return window;
}

const useGM = typeof GM_getValue !== 'undefined';

export function setValue(key: string, value: string) {
    if (useGM) {
        GM_setValue(key, value)
    } else {
        localStorage.setItem(`gl-${key}`, value)
    }
}

export function getValue(key: string, defaultValue?: string) {
    if (useGM) {
        return GM_getValue(key, defaultValue)
    } else {
        return localStorage.getItem(`gl-${key}`) ?? defaultValue
    }
}

export function deleteValue(key: string) {
    if (useGM) {
        GM_deleteValue(key)
    } else {
        localStorage.removeItem(`gl-${key}`)
    }
}

export function getModuleExports(moduleCallback: any): any {
    let moduleObject = {
        id: "",
        exports: {} as any
    };

    moduleCallback.call(moduleObject.exports, moduleObject, moduleObject.exports);

    return moduleObject.exports;
}