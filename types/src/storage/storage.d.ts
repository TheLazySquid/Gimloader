export default class Storage {
    addNameAndKey(pluginName: string, key: string): string;
    removeValue(pluginName: string, key: string): void;
    getValue(pluginName: string, key: string, defaultValue?: any): any;
    setValue(pluginName: string, key: string, value: any): void;
    removeAllValues(pluginName: string): void;
}
