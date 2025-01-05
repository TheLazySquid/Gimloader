import type { Matcher } from "$src/core/parcel";
import Parcel from "$src/core/parcel";
import { validate } from "$src/utils";

class BaseParcelApi {
    /**
     * Gets a module based on a filter, returns null if none are found
     * Be cautious when using this- plugins will often run before any modules load in,
     * meaning that if this is run on startup it will likely return nothing.
     * Consider using getLazy instead.
     */
    query(matcher: Matcher): any {
        if(!validate("parcel.query", arguments, ['matcher', 'function'])) return;

        return Parcel.query(matcher, false);
    }
    
    /**
     * Returns an array of all loaded modules matching a filter
     * Be cautious when using this- plugins will often run before any modules load in,
     * meaning that if this is run on startup it will likely return nothing.
     * Consider using getLazy instead.
     */
    queryAll(matcher: Matcher): any[] {
        if(!validate("parcel.queryAll", arguments, ['matcher', 'function'])) return;

        return Parcel.query(matcher, true);
    }
}

class ParcelApi extends BaseParcelApi {
    /** Waits for a module to be loaded, then runs a callback */
    getLazy(id: string, matcher: Matcher, callback: (exports: any) => any, initial = true) {
        if(!validate("parcel.getLazy", arguments,
            ['id', 'string'], ['matcher', 'function'],
            ['callback', 'function'], ['initial', 'boolean'])) return;
        
        return Parcel.getLazy(id, matcher, callback, initial);
    }

    /** Cancels any calls to getLazy with the same id */
    stopLazy(id: string) {
        if(!validate("parcel.stopLazy", arguments, ['id', 'string'])) return;

        Parcel.stopLazy(id);
    }
}

class ScopedParcelApi extends BaseParcelApi {
    constructor(private readonly id: string) { super() }
    
    /** Waits for a module to be loaded, then runs a callback */
    getLazy(matcher: Matcher, callback: (exports: any) => any, initial = true) {
        if(!validate("parcel.getLazy", arguments,
            ['matcher', 'function'], ['callback', 'function'], ['initial', 'boolean'])) return;

        return Parcel.getLazy(this.id, matcher, callback, initial);
    }
}

Object.freeze(BaseParcelApi);
Object.freeze(BaseParcelApi.prototype);
Object.freeze(ParcelApi);
Object.freeze(ParcelApi.prototype);
Object.freeze(ScopedParcelApi);
Object.freeze(ScopedParcelApi.prototype);
export { ParcelApi, ScopedParcelApi };