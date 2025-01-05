class BaseParcelApi {
    /**
     * Gets a module based on a filter, returns null if none are found
     * Be cautious when using this- plugins will often run before any modules load in,
     * meaning that if this is run on startup it will likely return nothing.
     * Consider using {@link getLazy} instead.
     */
    query(matcher: (exports: any) => boolean) {

    }
    
    /**
     * Returns an array of all loaded modules matching a filter
     * Be cautious when using this- plugins will often run before any modules load in,
     * meaning that if this is run on startup it will likely return nothing.
     * Consider using {@link getLazy} instead.
     */
    queryAll(matcher: (exports: any) => boolean) {
        
    }
}

class ParcelApi extends BaseParcelApi {
    /** Waits for a module to be loaded, then runs a callback */
    getLazy(id: string, matcher: (exports: any) => boolean, callback: (exports: any) => any) {

    }

    /** Cancels any calls to {@link getLazy} with the same id */
    stopLazy(id: string) {

    }
}

class ScopedParcelApi extends BaseParcelApi {
    /** Waits for a module to be loaded, then runs a callback */
    getLazy(matcher: (exports: any) => boolean, callback: (exports: any) => any) {

    }
}

Object.freeze(BaseParcelApi);
Object.freeze(BaseParcelApi.prototype);
Object.freeze(ParcelApi);
Object.freeze(ParcelApi.prototype);
Object.freeze(ScopedParcelApi);
Object.freeze(ScopedParcelApi.prototype);
export { ParcelApi, ScopedParcelApi };