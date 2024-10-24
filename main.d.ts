declare module '*.css' {
    const content: string;
    export default content;
}

declare module '*.scss' {
    const content: string;
    export default content;
}

declare module '*.svg' {
    const content: string;
    export default content;
}

declare module '*.svelte' {
    const component: import('svelte').ComponentType;
    export default component;
}

declare const GL: import('./src/gimloader').Gimloader;
/** @deprecated Use GL.stores */
declare const stores: any;
/** @deprecated No longer supported */
declare const platformerPhysics: any;
/** @deprecated Polyfills for Gimhook mods. Please use the built-in modding API */
declare const gimhook: any;

interface Window {
    GL: import('./src/gimloader').Gimloader;
    /** @deprecated Use GL.stores */
    stores: any;
    /** @deprecated No longer supported */
    platformerPhysics: any;
    /** @deprecated Polyfills for Gimhook mods. Please use the built-in modding API */
    gimhook: any;
}