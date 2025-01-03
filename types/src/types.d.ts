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
export interface IConfigurableHotkeyOptions {
    category: string;
    title: string;
    preventDefault?: boolean;
    defaultKeys?: Set<string>;
    default?: IHotkeyTriggerKey;
}
export interface IHotkeyTriggerKey {
    key: string;
    shift?: boolean;
    alt?: boolean;
    ctrl?: boolean;
}
export type HotkeyTrigger = IHotkeyTriggerKey | Set<string>;
export interface IHotkey {
    callback: (event: KeyboardEvent) => void;
    preventDefault: boolean;
    trigger: HotkeyTrigger;
}
