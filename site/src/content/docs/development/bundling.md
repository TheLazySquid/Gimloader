---
title: Bundling Scripts
description: An explanation of how to use a bundler with Gimloader
---

Sometimes you are going to want to make larger scripts spanning multiple files, or you may want to use external dependencies from npm. In that case, you're going to want to bundle your script. Gimloader provides a preconfigured bundler at `@gimloader/build`.

## Quickstart
To get started, make sure you have [Node.js](https://nodejs.org/) installed and then run this command wherever you want to make your project.

```bash
npm create @gimloader
```

Then, fill out the questions asked, cd into the directory you provided, and you're good to go!

## Usage

To build your script once, run `npx gl build`. To automatically rebuild the script whenever changes are made, run `npx gl serve`. This will also attempt to automatically install it on Gimloader if you enable "Poll for plugins/libraries being served locally" in settings and leave it open. Running `npx gl serve -m` acts the same, but rather than rebuilding whenever changes are made it will rebuild when you press enter in the terminal.

## Configuration

Configuration for the bundler is housed at `GL.config.js`. The following options are available:

| Name | Required | Plugin Only? | Purpose |
| ---- | -------- | ------------ | ------- |
| input | Yes | No | Which file to input to the bundler, for example `src/index.js` |
| name | Yes | No | The script's name |
| description | Yes | No | A description of what the script does |
| author | Yes | No | Who made the script |
| version | No | No | The version of the script, used for updates |
| downloadUrl | No | No | Where a raw version of the script be found, used for updates |
| reloadRequired | No | No | Whether the page needs to reload after a script is installed for it to work. Set to `true` for always, set to `ingame` for only when a game is currently active. |
| hasSettings | No | Yes | Whether a plugin has a settings menu, used to show it does when it's disabled |
| libs | No | Yes | An array of libraries the plugin needs to be enabled to work, formatted like `[Name] \| [Url]` |
| optionalLibs | No | Yes | The same as libs, but the plugin will still work without these and will not try to automatically download them |
| isLibrary | No | No | Set to true when making a library |
| plugins | No | No | An array of [esbuild](https://esbuild.github.io/) plugins to use |
| esbuildOptions | No | No | Any additional settings to pass to esbuild |

A `GL.config.js` file might look something like

```js
export default {
    name: "MyPlugin",
    description: "Does Something",
    author: "Me",
    version: "1.0.0"
}
```

## Using the Api

In order to best use the Gimloader api you should import it from the the `gimloader` npm package. This is automatically installed when running `npm create @gimloader`.
```js
// scoped
import GL from 'gimloader';

// unscoped
import GL from 'gimloader/global';
```