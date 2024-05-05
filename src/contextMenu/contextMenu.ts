import type { ReactElement } from "react";
import type { Gimloader } from "../gimloader";
import type { DropdownProps } from 'antd';

export default class ContextMenu {
    dropdownModule: any;
    gimloader: Gimloader;

    constructor(gimloader: Gimloader) {
        this.gimloader = gimloader;

        gimloader.parcel.interceptRequire(null,
        exports => exports?.default?.toString?.().includes(`.includes("contextMenu")`), (exports) => {
            this.dropdownModule = exports.default;
        }, true)
    }

    showContextMenu(options: DropdownProps, x: number, y: number) {
        let renderDiv = document.createElement("div");
        let divEl: HTMLElement;

        window.addEventListener("click", onClick, { capture: true });

        function onClick(e: MouseEvent) {
            // check we're not clicking on the dropdown itself
            if(e.target instanceof HTMLElement && e.target.closest(".ant-dropdown")) return;

            dispose();
        }
        
        function dispose() {
            renderDiv.remove();
            divEl?.remove();
            window.removeEventListener("click", onClick);
        }

        // get the content menu when it is added to the dom
        let observer = new MutationObserver((mutations) => {
            all: for(let mutation of mutations) {
                for(let node of mutation.addedNodes) {
                    if(node instanceof HTMLElement && node.querySelector(".ant-dropdown-menu")) {
                        divEl = node;
                        observer.disconnect();

                        // betcha forgot labels exist
                        break all;
                    }
                }
            }
        });

        observer.observe(document.body, { childList: true });

        // create the react element
        let reactDiv = this.gimloader.React.createElement("div", {
            style: {
                position: "absolute",
                left: x + "px",
                top: y + "px"
            }
        });

        let reactEl = this.gimloader.React.createElement(
            this.dropdownModule,
            { open: true, ...options, onOpenChange: dispose, destroyPopupOnHide: true },
            reactDiv
        );

        this.gimloader.ReactDOM.createRoot(renderDiv).render(reactEl);

        document.body.appendChild(renderDiv);

        return dispose;
    }

    createReactContextMenu(options: DropdownProps, element: ReactElement): ReactElement {
        return this.gimloader.React.createElement(this.dropdownModule, options, element);
    }
}
