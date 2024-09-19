export interface Setting {
    id: string;
    title: string;
}

export interface BooleanEl extends Setting {
    type: "boolean";
    default?: boolean;
}

export interface NumberEl extends Setting {
    type: "number";
    step?: number;
    min?: number;
    max?: number;
    default?: number;
}

export interface TextEl extends Setting {
    type: "text";
    maxLength?: number;
    default?: string;
}

export interface HeadingEl {
    type: "heading";
    text: string;
}

export type QSElement = BooleanEl | NumberEl | TextEl | HeadingEl;

export type QuickSettingsReturn = Record<string, any> & {
    openSettingsMenu: () => void
    listen: (property: string, callback: (value: any) => void) => void;
    onChange: (key: string, value: any) => void;
}