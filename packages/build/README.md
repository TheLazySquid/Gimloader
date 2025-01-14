# @gimloader/build

This is a package that provides a preconfigured bundler to help build more complex [Gimloader](https://github.com/TheLazySquid/Gimloader) plugins and libraries.

## Setup

To get started, run `npm create @gimloader` in the directory you wish to create the plugin / library in. You can also install it globally by running `npm i -g @gimloader/build`, which you may want for commands such as servefile.

## Config

Config is housed in the file GL.config.js in the root folder.

##### Mandatory Fields
- `input`: The input file that will be compiled.
- `name`: The name of the plugin / library.
- `description`: A brief description of the plugin / library.
- `author`: The author of the plugin / library.

##### Optional Fields
- `version`: The version of the plugin / library.
- `downloadUrl`: The download URL for the plugin / library, used by Gimloader for updates.
- `reloadRequired`: Set to true if the plugin / library needs a reload to take effect, or set to "ingame" if it only needs a reload when in-game.
- `plugins`: An array of Esbuild plugins to use
- `esbuildOptions`: Options to pass to esbuild

##### Plugin Fields (Optional)
- `libs`: A list of libraries to load. These strings should look like either "[library name]" or "[library name] | [download url]".
- `optionalLibs`: The same as libs, but the plugin will still be run without these libraries.

##### Library Fields
- `isLibrary`: Set to true if you are building a library.

### Building

Running `npx gl build` will compile the plugin / library and output it to `build/[plugin name].js`.

### Hot Reload

Running `npx gl serve` will start a local server to host the plugin / library. If the "Poll for plugins/libraries being served locally" setting is enabled on Gimloader, it will automatically detect changes to the plugin / library and reload it. By default, the plugin will be built whenever you save its files, but passing --manual will change it to only build when pressing enter in the terminal.

### Serving a single file

You can run `npx gl servefile <file>` to serve a single javscript file, which will automatically reload when the file is changed. Similarly to `gl serve`, passing --manual will change it to only update when pressing enter in the terminal.