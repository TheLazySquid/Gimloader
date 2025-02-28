import type { ReactElement } from "react";
import { focusTrapEnabled } from "$content/ui/stores";
import UI from "$core/ui/ui";

interface ModalButton {
    text: string;
    style?: "primary" | "danger" | "close";
    onClick?: (event: MouseEvent) => boolean | void;
}

/** @inline */
export interface ModalOptions {
    id: string;
    title: string;
    style: string;
    className: string;
    closeOnBackgroundClick: boolean;
    buttons: ModalButton[];
    onClosed: () => void;
}

let openModals = new Set<string>();

export default function showModal(content: HTMLElement | ReactElement, options: Partial<ModalOptions> = {}) {
    focusTrapEnabled.set(false);

    if(options?.id) {
        if(openModals.has(options.id)) return;
        openModals.add(options.id);
    }

    let bgEl = document.createElement("div");
    bgEl.className = "gl-modalBG";
    
    let modalEl = document.createElement("div");
    modalEl.className = "gl-modal";

    if(options?.className) modalEl.classList.add(options.className);
    if(options?.style) modalEl.style.cssText = options.style;

    // create the title and content
    if(options?.title) {
        let title = document.createElement("div");
        title.textContent = options.title;
        title.className = "title";
        modalEl.appendChild(title);
    }

    let modalContent = document.createElement("div");
    modalContent.className = "content";
    modalEl.appendChild(modalContent);

    if(options?.buttons) {
        let buttons = document.createElement("div");
        buttons.className = "buttons";
        modalEl.appendChild(buttons);

        // create the buttons
        for(let button of options.buttons) {
            let buttonEl = document.createElement("button");
            buttonEl.textContent = button.text;
            buttonEl.classList.add(button.style ?? "primary");

            buttonEl.addEventListener("click", (e) => {
                if(button.onClick) {
                    let cancel = button.onClick(e);
                    if(cancel) return;
                }
                
                closeModal();
            })

            buttons.appendChild(buttonEl);
        }
    }
    
    // render the content
    if(content instanceof HTMLElement) {
        modalContent.appendChild(content);
    } else {
        UI.ReactDOM.createRoot(modalContent).render(content);
    }
    
    bgEl.appendChild(modalEl);
    
    // close the modal when the background is clicked
    modalEl.addEventListener("click", e => e.stopPropagation());
    if(options?.closeOnBackgroundClick !== false) bgEl.onclick = closeModal;
    
    document.body.appendChild(bgEl);
    
    function closeModal() {
        focusTrapEnabled.set(true);
        if(options?.id) {
            openModals.delete(options.id);
        }
        bgEl.remove();
        if(options?.onClosed) options.onClosed();
    }

    return closeModal;
}