export interface IModuleRequired {
    type: 'moduleRequired';
    id?: string;
    callback: (module: any) => void;
}
export interface IInterceptRequire {
    type: 'interceptRequire';
    id?: string;
    match: (exports: any) => boolean;
    callback: (exports: any) => any;
    once: boolean;
}
type Intercept = IModuleRequired | IInterceptRequire;
export default class Parcel extends EventTarget {
    _parcelModuleCache: {};
    _parcelModules: {};
    reqIntercepts: Intercept[];
    readyToIntercept: boolean;
    constructor();
    onModuleRequired(id: string | null, callback: (module: any) => void): () => void;
    interceptRequire(id: string | null, match: (exports: any) => boolean, callback: (exports: any) => any, once?: boolean): () => void;
    stopIntercepts(id: string): void;
    decachedImport(url: string): Promise<any>;
    reloadExistingScripts(existingScripts: NodeListOf<HTMLScriptElement>): Promise<void>;
    setup(): void;
}
export {};
