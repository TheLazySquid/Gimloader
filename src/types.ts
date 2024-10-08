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

export type RequireHookFn = (moduleName: string) => void;

export interface RequireHook extends RequireHookFn {
    register: (moduleName: string, moduleCallback: any) => void;
}

export interface EasyAccessWritable<T> {
    value: T;
    set(value: T): void;
    update(): void;
    subscribe(callback: (value: T) => void): () => void;
}

export interface IConfigurableHotkey {
    id: string;
    category: string;
    title: string;
    preventDefault: boolean;
    callback: (event: KeyboardEvent) => void;
    keys: Set<string>;
    defaultKeys?: Set<string>;
}

export interface IConfigurableHotkeyOptions {
    category: string;
    title: string;
    preventDefault?: boolean;
    defaultKeys?: Set<string>;
}