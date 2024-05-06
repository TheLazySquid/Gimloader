export interface IModalButton {
    text: string;
    style?: "primary" | "danger" | "close";
    onClick?: (event: MouseEvent) => boolean | void;
}

export interface IModalOptions {
    title: string;
    style: string;
    className: string;
    closeOnBackgroundClick: boolean;
    buttons: IModalButton[];
    onClosed: () => void;
}

export interface IHotkey {
    callback: (event: KeyboardEvent) => void;
    preventDefault: boolean;
}