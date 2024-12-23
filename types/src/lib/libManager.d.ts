import Lib from './lib';
import type { EasyAccessWritable } from '$src/types';
import type { Gimloader } from '$src/gimloader';
declare const libManagerMethods: {
    getLib(libName: string): Lib;
    saveFn(): void;
    save(libs?: Record<string, string>): void;
    createLib(script: string, headers?: Record<string, any>, ignoreDuplicates?: boolean): Lib;
    deleteLib(lib: Lib): void;
    editLib(lib: Lib, code: string, headers?: Record<string, any>): Promise<void>;
};
export type GetLibType = (lib: string) => any;
export interface LibManagerBase extends GetLibType {
    get: GetLibType;
    libs: EasyAccessWritable<Lib[]>;
}
type additionalValuesType = typeof libManagerMethods;
export interface LibManagerType extends LibManagerBase, additionalValuesType {
}
declare function makeLibManager(gimloader: Gimloader): LibManagerType;
export default makeLibManager;
