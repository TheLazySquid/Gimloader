import LibManager from "$core/libManager/libManager.svelte";
import { validate } from "$src/utils";

class LibsApi {
    /** A list of all the libraries installed */
    get list() { return LibManager.getLibNames() };

    /** Gets whether or not a plugin is installed and enabled */
    isEnabled(name: string) {
        if(!validate("libs.isEnabled", arguments, ['name', 'string'])) return;

        return LibManager.isEnabled(name);
    }

    /** Gets the headers of a library, such as version, author, and description */
    getHeaders(name: string) {
        if(!validate("libs.getHeaders", arguments, ['name', 'string'])) return;

        return LibManager.getLibHeaders(name);
    }

    /** Gets the exported values of a library */
    get(name: string) {
        return LibManager.get(name);
    }
}

Object.freeze(LibsApi);
Object.freeze(LibsApi.prototype);
export default LibsApi;