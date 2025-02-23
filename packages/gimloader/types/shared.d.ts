import './types';

declare const GL: typeof import('content/api/api').default;
/** @deprecated Use GL.stores */
declare const stores: any;
/** @deprecated No longer supported */
declare const platformerPhysics: any;

interface Window {
    GL: typeof import('content/api/api').default;
    /** @deprecated Use GL.stores */
    stores: any;
    /** @deprecated No longer supported */
    platformerPhysics: any;
}