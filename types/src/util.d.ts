export declare function log(...args: any[]): void;
export declare function getUnsafeWindow(): (Window & Omit<typeof globalThis, "GM_addElement" | "GM_addStyle" | "GM_addValueChangeListener" | "GM_deleteValue" | "GM_download" | "GM_getResourceText" | "GM_getResourceURL" | "GM_getTab" | "GM_getTabs" | "GM_getValue" | "GM_info" | "GM_listValues" | "GM_log" | "GM_notification" | "GM_openInTab" | "GM_registerMenuCommand" | "GM_removeValueChangeListener" | "GM_saveTab" | "GM_setClipboard" | "GM_setValue" | "GM_unregisterMenuCommand" | "GM_xmlhttpRequest" | "GM">) | (Window & typeof globalThis);
export declare function setValue(key: string, value: string): void;
export declare function getValue(key: string, defaultValue?: string): string;
export declare function deleteValue(key: string): void;
export declare function getModuleExports(moduleCallback: any): any;
