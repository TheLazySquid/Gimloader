export interface IModalButton {
    text: string;
    style?: "primary" | "danger" | "close";
    onClick?: (event: MouseEvent) => boolean | void;
}

export interface IModalOptions {
    id: string;
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

export interface IModuleRequired {
    type: 'moduleRequired';
    id?: string;
    callback: (module: any) => void;
}

export interface IInterceptRequire {
    type: 'interceptRequire';
    id?: string;
    match: (exports: any) => boolean;
    callback: (exports: any) => any;
    once: boolean;
}

export type Intercept = IModuleRequired | IInterceptRequire;

export interface IPluginInfo {
    script: string;
    enabled: boolean;
}