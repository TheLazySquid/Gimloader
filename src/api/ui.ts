import type { ModalOptions } from "$core/ui/modal";
import showModal from "$core/ui/modal";
import UI from "$core/ui/ui";
import { validate } from "$src/utils";
import type { ReactElement } from "react";

class BaseUIApi {
    /** Shows a customizable modal to the user */
    showModal(element: HTMLElement | ReactElement, options: Partial<ModalOptions> = {}) {
        if(!validate("UI.showModal", arguments, ['element', 'any'])) return;

        showModal(element, options);
    }
}

class UIApi extends BaseUIApi {
    /** Adds a style to the DOM */
    addStyles(id: string, style: string) {
        if(!validate("UI.removeStyles", arguments, ['id', 'string'], ['style', 'string'])) return;

        return UI.addStyles(id, style);
    }

    /** Remove all styles with a given id */
    removeStyles(id: string) {
        if(!validate("UI.removeStyles", arguments, ['id', 'string'])) return;

        UI.removeStyles(id);
    }
}

class ScopedUIApi extends BaseUIApi {
    constructor(private readonly id: string) { super() }

    /** Adds a style to the DOM */
    addStyles(style: string) {
        if(!validate("UI.removeStyles", arguments, ['style', 'string'])) return;

        return UI.addStyles(this.id, style);
    }
}

Object.freeze(BaseUIApi);
Object.freeze(BaseUIApi.prototype);
Object.freeze(UIApi);
Object.freeze(UIApi.prototype);
Object.freeze(ScopedUIApi);
Object.freeze(ScopedUIApi.prototype);
export { UIApi, ScopedUIApi };