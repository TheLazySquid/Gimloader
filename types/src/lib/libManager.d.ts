import Lib from './lib';
declare const libManagerMethods: {
    getLib(libName: string): Lib;
    updateReact(): void;
    save(libs?: Record<string, string>): void;
    createLib(script: string, headers?: Record<string, any>, ignoreDuplicates?: boolean): Lib;
    deleteLib(lib: Lib): void;
    editLib(lib: Lib, code: string, headers?: Record<string, any>): void;
};
export type GetLibType = (lib: string) => any;
export interface LibManagerBase extends GetLibType {
    get: GetLibType;
    libs: Record<string, Lib>;
    reactSetLibs?: (libs: Record<string, Lib>) => void;
    updateLibTimeout: any;
}
type additionalValuesType = typeof libManagerMethods;
export interface LibManagerType extends LibManagerBase, additionalValuesType {
}
declare function makeLibManager(): LibManagerType;
export default makeLibManager;
