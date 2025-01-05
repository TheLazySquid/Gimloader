import type { ReactElement } from "react";

interface ModalButton {
    text: string;
    style?: "primary" | "danger" | "close";
    onClick?: (event: MouseEvent) => boolean | void;
}

interface ModalOptions {
    id: string;
    title: string;
    style: string;
    className: string;
    closeOnBackgroundClick: boolean;
    buttons: ModalButton[];
    onClosed: () => void;
}

class BaseUIApi {


    /** Shows a customizable modal to the user */
    showModal(element: HTMLElement | ReactElement, options?: ModalOptions) {

    }
}

class UIApi {
    /** Adds a style to the DOM */
    addStyle(id: string, style: string) {

    }

    /** Remove all styles with a given id */
    removeStyles(id: string) {

    }
}

class ScopedUIApi {
    /** Adds a style to the DOM */
    addStyle(style: string) {

    }
}

Object.freeze(BaseUIApi);
Object.freeze(BaseUIApi.prototype);
Object.freeze(UIApi);
Object.freeze(UIApi.prototype);
Object.freeze(ScopedUIApi);
Object.freeze(ScopedUIApi.prototype);
export { UIApi, ScopedUIApi };