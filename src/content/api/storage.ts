import Storage from "$content/core/storage.svelte";
import { validate } from "$content/utils";

class StorageApi {
    /** Gets a value that has previously been saved */
    getValue(pluginName: string, key: string, defaultValue?: any) {
        if(!validate("storage.getValue", arguments, ['pluginName', 'string'], ['key', 'string'])) return;

        return Storage.getPluginValue(pluginName, key, defaultValue);
    }

    /** Sets a value which can be retrieved later, through reloads */
    setValue(pluginName: string, key: string, value: any) {
        if(!validate("storage.setValue", arguments, ['pluginName', 'string'], ['key', 'string'])) return;

        return Storage.setPluginValue(pluginName, key, value);
    }

    /** Removes a value which has been saved */
    deleteValue(pluginName: string, key: string) {
        if(!validate("storage.deleteValue", arguments, ['pluginName', 'string'], ['key', 'string'])) return;

        return Storage.deletePluginValue(pluginName, key);
    }

    /**
     * @deprecated use {@link deleteValue}
     * @hidden
     */
    get removeValue() { return this.deleteValue };
}

class ScopedStorageApi {
    constructor(private readonly id: string) {}

    /** Gets a value that has previously been saved */
    getValue(key: string, defaultValue?: any) {
        if(!validate("storage.getValue", arguments, ['key', 'string'])) return;

        return Storage.getPluginValue(this.id, key, defaultValue);
    }

    /** Sets a value which can be retrieved later, persisting through reloads */
    setValue(key: string, value: any) {
        if(!validate("storage.setValue", arguments, ['key', 'string'])) return;

        Storage.setPluginValue(this.id, key, value);
    }

    /** Removes a value which has been saved */
    deleteValue(key: string) {
        if(!validate("storage.deleteValue", arguments, ['key', 'string'])) return;

        Storage.deletePluginValue(this.id, key);
    }
}

Object.freeze(StorageApi);
Object.freeze(StorageApi.prototype);
Object.freeze(ScopedStorageApi);
Object.freeze(ScopedStorageApi.prototype);
export { StorageApi, ScopedStorageApi };