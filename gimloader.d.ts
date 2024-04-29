import { Gimloader } from './types/src/index';

declare global {
    const GL: Gimloader;
    /** @deprecated Use GL.stores */
    const stores: any;
    /** @deprecated Use GL.platformerPhysics */
    const platformerPhysics: any;
    
    interface Window {
        GL: Gimloader;
        /** @deprecated Use GL.stores */
        stores: any;
        /** @deprecated Use GL.platformerPhysics */
        platformerPhysics: any;
    }
}