declare class StorageApi {
    /** Gets a value that has previously been saved */
    getValue(pluginName: string, key: string, defaultValue?: any): void;
    /** Sets a value which can be retrieved later, through reloads */
    setValue(pluginName: string, key: string, value: any): void;
    /** Removes a value which has been saved */
    deleteValue(pluginName: string, key: string): void;
}
declare class ScopedStorageApi {
    /** Gets a value that has previously been saved */
    getValue(key: string, defaultValue?: any): void;
    /** Sets a value which can be retrieved later, through reloads */
    setValue(key: string, value: any): void;
    /** Removes a value which has been saved */
    deleteValue(key: string): void;
}
export { StorageApi, ScopedStorageApi };
