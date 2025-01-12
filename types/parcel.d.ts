declare class BaseParcelApi {
    /**
     * Gets a module based on a filter, returns null if none are found
     * Be cautious when using this- plugins will often run before any modules load in,
     * meaning that if this is run on startup it will likely return nothing.
     * Consider using {@link getLazy} instead.
     */
    query(matcher: (exports: any) => boolean): void;
    /**
     * Returns an array of all loaded modules matching a filter
     * Be cautious when using this- plugins will often run before any modules load in,
     * meaning that if this is run on startup it will likely return nothing.
     * Consider using {@link getLazy} instead.
     */
    queryAll(matcher: (exports: any) => boolean): void;
}
declare class ParcelApi extends BaseParcelApi {
    /** Waits for a module to be loaded, then runs a callback */
    getLazy(id: string, matcher: (exports: any) => boolean, callback: (exports: any) => any): void;
    /** Cancels any calls to {@link getLazy} with the same id */
    stopLazy(id: string): void;
}
declare class ScopedParcelApi extends BaseParcelApi {
    /** Waits for a module to be loaded, then runs a callback */
    getLazy(matcher: (exports: any) => boolean, callback: (exports: any) => any): void;
}
export { ParcelApi, ScopedParcelApi };
