import Api from './types/api';

declare global {
    const GL: Api;
    // /** @deprecated Use GL.stores */
    // const stores: any;
    // /** @deprecated No longer supported */
    // const platformerPhysics: any;
    
    interface Window {
        GL: Api;
        // /** @deprecated Use GL.stores */
        // stores: any;
        // /** @deprecated No longer supported */
        // platformerPhysics: any;
    }
}