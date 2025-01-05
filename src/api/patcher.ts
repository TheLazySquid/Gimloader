import type { PatcherAfterCallback, PatcherBeforeCallback, PatcherInsteadCallback } from "$src/core/patcher";
import Patcher from "$src/core/patcher";
import { validate } from "$src/utils";

class PatcherApi {
    /** Runs a callback after a function on an object has been run */
    after(id: string, object: any, method: string, callback: PatcherAfterCallback) {
        if(!validate("patcher.after", arguments,
            ['id', 'string'], ['object', 'object'], ['method', 'string'], ['callback', 'function'])) return;

        return Patcher.after(id, object, method, callback);   
    }
    
    /**
     * Runs a callback before a function on an object has been run.
     * Return true from the callback to prevent the function from running
     */
    before(id: string, object: any, method: string, callback: PatcherBeforeCallback) {
        if(!validate("patcher.before", arguments,
            ['id', 'string'], ['object', 'object'], ['method', 'string'], ['callback', 'function'])) return;

        return Patcher.before(id, object, method, callback);   
    }

    /** Runs a function instead of a function on an object */
    instead(id: string, object: any, method: string, callback: PatcherInsteadCallback) {
        if(!validate("patcher.instead", arguments,
            ['id', 'string'], ['object', 'object'], ['method', 'string'], ['callback', 'function'])) return;

        return Patcher.instead(id, object, method, callback);
    }

    /** Removes all patches with a given id */
    unpatchAll(id: string) {
        if(!validate("patcher.unpatchAll", arguments, ['id', 'string'])) return;

        Patcher.unpatchAll(id);
    }
}

class ScopedPatcherApi {
    constructor(private readonly id: string) {}

    /** Runs a callback after a function on an object has been run */
    after(object: any, method: string, callback: PatcherAfterCallback) {
        if(!validate("patcher.after", arguments,
            ['object', 'object'], ['method', 'string'], ['callback', 'function'])) return;

        return Patcher.after(this.id, object, method, callback);
    }

    /**
     * Runs a callback before a function on an object has been run.
     * Return true from the callback to prevent the function from running
     */
    before(object: any, method: string, callback: PatcherBeforeCallback) {
        if(!validate("patcher.after", arguments,
            ['object', 'object'], ['method', 'string'], ['callback', 'function'])) return;

        return Patcher.before(this.id, object, method, callback);
    }

    /** Runs a function instead of a function on an object */
    instead(object: any, method: string, callback: PatcherInsteadCallback) {
        if(!validate("patcher.after", arguments,
            ['object', 'object'], ['method', 'string'], ['callback', 'function'])) return;

        return Patcher.instead(this.id, object, method, callback);
    }
}

Object.freeze(PatcherApi);
Object.freeze(PatcherApi.prototype);
Object.freeze(ScopedPatcherApi);
Object.freeze(ScopedPatcherApi.prototype);
export { PatcherApi, ScopedPatcherApi };