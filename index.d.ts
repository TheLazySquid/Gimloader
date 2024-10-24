import { Gimloader } from './types/src/gimloader';

declare global {
    const GL: Gimloader;
    /** @deprecated Use GL.stores */
    const stores: any;
    /** @deprecated No longer supported */
    const platformerPhysics: any;
    
    interface Window {
        GL: Gimloader;
        /** @deprecated Use GL.stores */
        stores: any;
        /** @deprecated No longer supported */
        platformerPhysics: any;
    }
}