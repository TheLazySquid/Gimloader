import './types';

declare const GL: typeof import('src/api/api').default;
/** @deprecated Use GL.stores */
declare const stores: any;
/** @deprecated Polyfills for Gimhook mods. Please use the built-in modding API */
declare const gimhook: any;
/** @deprecated No longer supported */
declare const platformerPhysics: any;

interface Window {
    GL: typeof import('src/api/api').default;
    /** @deprecated Use GL.stores */
    stores: any;
    /** @deprecated Polyfills for Gimhook mods. Please use the built-in modding API */
    gimhook: any;
    /** @deprecated No longer supported */
    platformerPhysics: any;
}