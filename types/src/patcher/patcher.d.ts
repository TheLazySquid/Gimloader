type PatcherAfterCallback = (thisArg: any, args: IArguments, returnValue: any) => any;
type PatcherBeforeCallback = (thisArg: any, args: IArguments) => any;
type PatcherInsteadCallback = (thisArg: any, args: IArguments) => any;
type Patch = {
    callback: PatcherBeforeCallback;
    point: 'before';
} | {
    callback: PatcherAfterCallback;
    point: 'after';
} | {
    callback: PatcherInsteadCallback;
    point: 'instead';
};
export default class Patcher {
    patches: Map<object, Map<string, {
        original: any;
        patches: Patch[];
    }>>;
    unpatchers: Map<string, (() => void)[]>;
    applyPatches(object: object, property: string): void;
    addPatch(object: object, property: string, patch: Patch): void;
    getRemovePatch(id: string | null, object: object, property: string, patch: Patch): () => void;
    after(id: string | null, object: object, property: string, callback: PatcherAfterCallback): () => void;
    before(id: string | null, object: object, property: string, callback: PatcherBeforeCallback): () => void;
    instead(id: string | null, object: object, property: string, callback: PatcherInsteadCallback): () => void;
    unpatchAll(id: string): void;
}
export {};
