/// <reference types="react" />
import type Plugin from "$src/pluginManager/plugin";
export default function LibraryInfo({ plugin }: {
    plugin: Plugin;
}): import("react").JSX.Element;
