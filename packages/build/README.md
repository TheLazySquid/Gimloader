# @gimloader/build

This is a package that provides a set of tools to help build more complex [Gimloader](https://github.com/TheLazySquid/Gimloader) plugins / libraries.

## Installation

```bash
npm i -g @gimloader/build
```

## Usage

### Setup

To get started, make an empty folder and run the following command in the terminal:

```bash
gl init
```

From there you will be given some options to choose from. This command will generate the file `GL.config.js`, which houses the configuration for the build tools. You can pick between [esbuild](https://esbuild.github.io/) and [Rollup](https://rollupjs.org/) for bundlers.

##### Mandatory Fields
- `input`: The input file that will be compiled.
- `name`: The name of the plugin / library.
- `description`: A brief description of the plugin / library.
- `author`: The author of the plugin / library.

##### Optional Fields
- `version`: The version of the plugin / library.
- `downloadUrl`: The download URL for the plugin / library, used by Gimloader for updates.
- `bundler`: This decides which bundler is used. Set to esbuild to use esbuild, otherwise Rollup is used.
- `reloadRequired`: Set to true if the plugin / library needs a reload to take effect, or set to "ingame" if it only needs a reload when in-game.

##### Optional Fields (Rollup)
- `plugins`: An array of Rollup plugins to use.
- `rollupOptions`: Options to pass to Rollup.
- `outputOptions`: Options to pass to Rollup's output.

##### Optional Fields (Esbuild)
- `plugins`: An array of Esbuild plugins to use
- `esbuildOptions`: Options to pass to esbuild

##### Plugin Fields (Optional)
- `libs`: A list of libraries to load. These strings should look like either "[library name]" or "[library name] | [download url]".
- `optionalLibs`: The same as libs, but the plugin will still be run without these libraries.

##### Library Fields
- `isLibrary`: Set to true if you are building a library.

### Building

Running `gl build` will compile the plugin / library and output it to `build/[plugin name].js`.

### Hot Reload

Running `gl serve` will start a local server to host the plugin / library. If the "Poll for plugins/libraries being served locally" setting is enabled on Gimloader, it will automatically detect changes to the plugin / library and reload it. By default, the plugin will be built whenever you save its files, but passing --manual will change it to only build when pressing enter in the terminal.

### Serving a single file

You can run `gl servefile <file>` to serve a single javscript file, which will automatically reload when the file is changed. Similarly to `gl serve`, passing --manual will change it to only update when pressing enter in the terminal.