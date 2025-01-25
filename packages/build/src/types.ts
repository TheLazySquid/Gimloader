import type { BuildOptions, Plugin } from "esbuild";

export interface IPluginTypes {
    /**
     * Whether the plugin / library is a library.
     */
    isLibrary?: false;
    /**
     * A list of libraries that the plugin requires to start.
     * Libraries are formatted like "[name]" or "[name] | [downloadUrl]".
     */
    libs: string[];
    /**
     * A list of libraries that the plugin will optionally use.
     * Libraries are formatted like "[name]" or "[name] | [downloadUrl]".
     */
    optionalLibs: string[];
    /**
     * Whether the plugin has a settings menu.
     */
    hasSettings: boolean;
}

export interface LibraryTypes {
    /**
     * Whether the plugin / library is a library.
     */
    isLibrary: true;
}

export type Config = (IPluginTypes | LibraryTypes) & {
    /**
     * The input file that will be compiled.
     */
    input: string;
    /**
     * The name of the plugin / library. This will be used as the name of the output file.
     */
    name: string;
    /**
     * A brief description of the plugin / library.
     */
    description: string;
    /**
     * The author of the plugin / library.
     */
    author: string;
    /**
     * The version of the plugin / library.
     */
    version?: string;
    /**
     * A URL to get the raw code of the plugin / library, used for updates.
     */
    downloadUrl?: string;
    /**
     * A webpage where users can get more information about the plugin / library.
     */
    webpage?: string;
    /**
     * Whether the browser needs to be reloaded after the plugin is added.
     * If set to "ingame" it will only reload if the user is currently in a game.
     */
    reloadRequired?: boolean | "ingame";
    /**
     * Esbuild plugins to use when building the plugin/library
     */
    plugins?: Plugin[];
    /**
     * Options to be passed to esbuild's build and context functions
     */
    esbuildOptions?: BuildOptions;
}

export interface GLConfig {
    default: Config;
}