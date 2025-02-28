import Storage, { type ValueChangeCallback } from "$core/storage.svelte";
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

    /** Adds a listener for when a plugin's stored value with a certain key changes */
    onChange(pluginName: string, key: string, callback: ValueChangeCallback) {
        if(!validate("storage.onChange", arguments, ['pluginName', 'string'], ['key', 'string'], ['callback', 'function'])) return;

        return Storage.onPluginValueUpdate(pluginName, key, callback);
    }

    /** Removes a listener added by onChange */
    offChange(pluginName: string, key: string, callback: ValueChangeCallback) {
        if(!validate("storage.offChange", arguments, ['pluginName', 'string'], ['key', 'string'], ['callback', 'function'])) return;

        Storage.offPluginValueUpdate(pluginName, key, callback);
    }

    /** Removes all listeners added by onChange for a certain plugin */
    offAllChanges(pluginName: string) {
        if(!validate("storage.offAllChanges", arguments, ['pluginName', 'string'])) return;

        Storage.removeUpdateListeners(pluginName);
    }
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

    /** Adds a listener for when a stored value with a certain key changes  */
    onChange(key: string, callback: ValueChangeCallback) {
        return Storage.onPluginValueUpdate(this.id, key, callback);
    }
}

Object.freeze(StorageApi);
Object.freeze(StorageApi.prototype);
Object.freeze(ScopedStorageApi);
Object.freeze(ScopedStorageApi.prototype);
export { StorageApi, ScopedStorageApi };