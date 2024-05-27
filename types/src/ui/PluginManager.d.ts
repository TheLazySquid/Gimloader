/// <reference types="react" />
import type PluginManager from "../pluginManager/pluginManager";
export default function PluginManagerUI({ pluginManager }: {
    pluginManager: PluginManager;
}): import("react").JSX.Element;
