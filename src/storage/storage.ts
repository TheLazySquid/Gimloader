export default class Storage {
    addNameAndKey(pluginName: string, key: string) {
        return `${pluginName}-${key}`
    }

    removeValue(pluginName: string, key: string) {
        if(pluginName == "") throw new Error("pluginName cannot be empty");
        GM_deleteValue(this.addNameAndKey(pluginName, key));
    }

    getValue(pluginName: string, key: string, defaultValue?: any) {
        if(pluginName == "") throw new Error("pluginName cannot be empty");
        return GM_getValue(this.addNameAndKey(pluginName, key), defaultValue);
    }

    setValue(pluginName: string, key: string, value: any) {
        if(pluginName == "") throw new Error("pluginName cannot be empty");
        GM_setValue(this.addNameAndKey(pluginName, key), value);
    }

    removeAllValues(pluginName: string) {
        if(pluginName == "") throw new Error("pluginName cannot be empty");
        let values = GM_listValues().filter(v => v.startsWith(`${pluginName}-`));

        for(let value of values) {
            GM_deleteValue(value);
        }
    }
}