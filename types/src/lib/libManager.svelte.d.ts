import Lib from './lib';
import type { Gimloader } from '$src/gimloader.svelte';
export declare class LibManagerClass {
    libs: Lib[];
    gimloader: Gimloader;
    constructor(gimloader: Gimloader);
    getLib(libName: string): Lib;
    saveFn(): void;
    saveDebounced?: () => void;
    save(): void;
    createLib(script: string, headers?: Record<string, any>, ignoreDuplicates?: boolean): Lib;
    deleteLib(lib: Lib): void;
    editLib(lib: Lib, code: string, headers?: Record<string, any>): Promise<void>;
    wipe(): void;
}
export type GetLibType = (lib: string) => any;
export interface LibType extends GetLibType {
    get: GetLibType;
    getLib: (libName: string) => Lib;
}
declare function makeLibManager(gimloader: Gimloader): [LibType, LibManagerClass];
export default makeLibManager;
