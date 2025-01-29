import type { State } from "$types/state";
import { saveDebounced } from "$bg/state";

export function libraryOnUpdate(state: State, type: string, message: any) {
    switch(type) {
        case "libraryEdit":
            let lib = state.libraries.find((lib) => lib.name === message.name);
            lib.script = message.script;
            lib.name = message.newName;
            saveDebounced('libraries');
            return true;
        case "libraryDelete":
            state.libraries = state.libraries.filter((lib => lib.name !== message.name));
            saveDebounced('libraries');
            return true;
        case "librariesDeleteAll":
            state.libraries = [];
            saveDebounced('libraries');
            return true;
        case "libraryCreate":
            state.libraries.unshift({
                name: message.name,
                script: message.script
            });
            saveDebounced('libraries');
            return true;
        case "librariesArrange":
            let newLibraries = [];
            for(let name of message.order) {
                let lib = state.libraries.find((lib) => lib.name === name);
                newLibraries.push(lib);
            }
            state.libraries = newLibraries;
            saveDebounced('libraries')
            return true;
    }

    return false;
}