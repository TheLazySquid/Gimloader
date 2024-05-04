import type { ReactElement } from "react";
import type { Gimloader } from "../index";
import type { DropdownProps } from 'antd';
export default class ContextMenu {
    dropdownModule: any;
    gimloader: Gimloader;
    constructor(gimloader: Gimloader);
    showContextMenu(options: DropdownProps, x: number, y: number): () => void;
    createReactContextMenu(options: DropdownProps, element: ReactElement): ReactElement;
}
