import type { InputPluginOption, OutputOptions, RollupOptions } from "rollup";

export interface IMandatory {
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
}

export interface IOptional extends IMandatory {
    /**
     * The version of the plugin / library.
     */
    version?: string;
    /**
     * A URL to get the raw code of the plugin / library, used for updates.
     */
    downloadUrl?: string;
    /**
     * Rollup plugins to use when building the plugin / library.
     */
    plugins?: InputPluginOption[];
    /**
     * Options to pass to rollup.
     */
    rollupOptions?: RollupOptions;
    /**
     * Options to pass to rollup.write
     */
    outputOptions?: OutputOptions;
}

export interface IPluginTypes extends IOptional {
    /**
     * Whether the plugin / library is a library.
     */
    isLibrary?: false;
    /**
     * Whether the browser needs to be reloaded after the plugin is added.
     * If set to "ingame" it will only reload if the user is currently in a game.
     */
    reloadRequired: boolean | "ingame";
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
}

export interface ILibraryTypes extends IOptional {
    /**
     * Whether the plugin / library is a library.
     */
    isLibrary: true;
}

export type Config = IPluginTypes | ILibraryTypes;

export interface GLConfig {
    default: Config;
}