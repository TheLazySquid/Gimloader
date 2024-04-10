import { GimkitLoader } from './types/src/index';

declare global {
    const GL: GimkitLoader;
    /** @deprecated Use GL.stores */
    const stores: any;
    /** @deprecated Use GL.platformerPhysics */
    const platformerPhysics: any;
    
    interface Window {
        GL: GimkitLoader;
        /** @deprecated Use GL.stores */
        stores: any;
        /** @deprecated Use GL.platformerPhysics */
        platformerPhysics: any;
    }
}