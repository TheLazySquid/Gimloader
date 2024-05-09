import type { Gimloader } from "../gimloader";
import type { Intercept } from "../types";
export default class Parcel extends EventTarget {
    gimloader: Gimloader;
    _parcelModuleCache: {};
    _parcelModules: {};
    reqIntercepts: Intercept[];
    readyToIntercept: boolean;
    constructor(loader: Gimloader);
    hostRedirect(): Promise<void>;
    emptyModules(): void;
    onModuleRequired(id: string | null, callback: (module: any) => void): () => void;
    interceptRequire(id: string | null, match: (exports: any) => boolean, callback: (exports: any) => any, once?: boolean): () => void;
    stopIntercepts(id: string): void;
    decachedImport(url: string): Promise<any>;
    reloadExistingScripts(existingScripts: NodeListOf<HTMLScriptElement>): Promise<void>;
    nukeDom(): void;
    setup(): void;
}
