import Api from "./api/api";

Object.defineProperty(unsafeWindow, "GL", {
    value: Api,
    writable: false,
    configurable: false
});