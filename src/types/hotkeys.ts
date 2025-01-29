/** @inline */
export interface HotkeyTrigger {
    /** Should be a keyboardevent [code](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code) */
    key?: string;
    /** Should be keyboardevent [codes](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code) */
    keys?: string[];
    ctrl?: boolean;
    shift?: boolean;
    alt?: boolean;
}

/** @inline */
export interface HotkeyOptions extends HotkeyTrigger {
    preventDefault?: boolean;
}

/** @inline */
export interface ConfigurableHotkeyOptions {
    category: string;
    /** There should be no duplicate titles within a category */
    title: string;
    preventDefault?: boolean;
    default?: HotkeyTrigger;
}