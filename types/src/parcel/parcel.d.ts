type Intercept = {
    id?: string;
    match: (exports: any) => boolean;
    callback: (exports: any) => any;
    once: boolean;
};
export default class Parcel extends EventTarget {
    _parcelModuleCache: {};
    _parcelModules: {};
    reqIntercepts: Intercept[];
    readyToIntercept: boolean;
    constructor();
    interceptRequire(id: string | null, match: (exports: any) => boolean, callback: (exports: any) => any, once?: boolean): () => void;
    stopIntercepts(id: string): void;
    reloadExistingScript(): Promise<void>;
    setup(): void;
}
export {};
