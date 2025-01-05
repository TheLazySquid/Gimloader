class StorageApi {
    /** Gets a value that has previously been saved */
    getValue(pluginName: string, key: string, defaultValue?: any) {

    }

    /** Sets a value which can be retrieved later, through reloads */
    setValue(pluginName: string, key: string, value: any) {

    }

    /** Removes a value which has been saved */
    deleteValue(pluginName: string, key: string) {
        
    }
}

class ScopedStorageApi {
    /** Gets a value that has previously been saved */
    getValue(key: string, defaultValue?: any) {

    }

    /** Sets a value which can be retrieved later, through reloads */
    setValue(key: string, value: any) {

    }

    /** Removes a value which has been saved */
    deleteValue(key: string) {
        
    }
}

Object.freeze(StorageApi);
Object.freeze(StorageApi.prototype);
Object.freeze(ScopedStorageApi);
Object.freeze(ScopedStorageApi.prototype);
export { StorageApi, ScopedStorageApi };