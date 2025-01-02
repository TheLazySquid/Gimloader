function getValue(key, defaultVal) {
    let val = localStorage.getItem(`GL_${key}`);
    if(val) return JSON.parse(val);
    return defaultVal;
}

function setValue(key, val) {
    localStorage.setItem(`GL_${key}`, JSON.stringify(val));
}

function deleteValue(key) {
    localStorage.removeItem(`GL_${key}`);
}

function listValues() {
    let keys = Object.keys(localStorage);
    return keys.filter(k => k.startsWith("GL_"));
}

function xmlHttpRequest() {
    return Promise.reject(new Error("Cannot use networking functions with a polyfill"));
}

function noop() {}

window.unsafeWindow = window;
window.GM = {};
window.GM_getValue = getValue;
window.GM_setValue = setValue;
window.GM_deleteValue = deleteValue;
window.GM_listValues = listValues;
window.GM_addValueChangeListener = noop;
window.GM.registerMenuCommand = noop;
window.GM.xmlHttpRequest = xmlHttpRequest;