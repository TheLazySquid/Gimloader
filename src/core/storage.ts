export default class Storage {
    static getValue(key: string, defaultVal?: any) {
        return GM_getValue(key, defaultVal);
    }

    static setValue(key: string, value: any) {
        GM_setValue(key, value);
    }

    static deleteValue(key: string) {
        GM_deleteValue(key);
    }

    static getPluginValue(id: string, key: string, defaultVal?: any) {
        return GM_getValue(`${id}-${key}`, defaultVal);
    }
    
    static setPluginValue(id: string, key: string, value: any) {
        GM_setValue(`${id}-${key}`, value);
    }

    static deletePluginValue(id: string, key: string) {
        GM_deleteValue(`${id}-${key}`);
    }
}