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
    const component: import('svelte').Component;
    export default component;
}

declare const GL: typeof import('./src/api/api').default;
/** @deprecated Use GL.stores */
declare const stores: any;
/** @deprecated Polyfills for Gimhook mods. Please use the built-in modding API */
declare const gimhook: any;
/** @deprecated No longer supported */
declare const platformerPhysics: any;

interface Window {
    GL: typeof import('./src/api/api').default;
    /** @deprecated Use GL.stores */
    stores: any;
    /** @deprecated Polyfills for Gimhook mods. Please use the built-in modding API */
    gimhook: any;
    /** @deprecated No longer supported */
    platformerPhysics: any;
}