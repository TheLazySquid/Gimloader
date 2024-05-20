# Build Tools

## Installation

To use Gimloader's build tools, you should first install them globally. You can do this by running the following command:

```bash
npm install -g gimloader@github:TheLazySquid/Gimloader
```

## Commands

When Gimloader is installed in an npm project, it adds the `gimloader` (or `gl`) command, which can be run with npx or npm scripts. The command has the following subcommands:

### `gl init`

This initializes new project with the neccesary setup. You can select from several plugins to start with. This should be run from within the directory you want to create the project in.

### `gl build`

This will build the project based on the configuration in GL.config.js. It will output the built files to the `build` directory.

## Configuration

The build tools are configured using a GL.config.js file in the root of your project. This file should export an object with the following properties:

- `input`: The entry point of your project. Ex: `src/index.js`
- `name`: The name of the plugin. This will be used as the name of the output file. Ex: `my-plugin`
- `description`: A description of the plugin.
- `author`: The author of the plugin.

### Optional Properties

- `version`: The version of the plugin to be displayed. This will help with updating plugins.
- `downloadUrl`: A URL to download the raw plugin from, typically from a Github repo. Without this, the option to check for updates for the plugin will not be available.
- `plugins`: Under the hood, Gimloader uses rollup to bundle projects. This property allows you to pass in an array of [rollup plugins](https://rollupjs.org/configuration-options/#output-plugins) to use. Ex: `plugins: [someRollupPlugin()]`.
- `reloadRequired`: Whether or not the plugin requires a reload to take effect. This is optional, and defaults to false. If set to true, the user will be prompted to reload their page when the plugin is enabled.
- `rollupOptions`: Anything in here will be passed to Rollup's `rollup` function.
- `outputOptions`: Anything in here will be passed to Rollup's `bundle.write`.

Here is an example GL.config.js file:

```js
import typescript from '@rollup/plugin-typescript';

module.exports = {
    input: 'src/index.js',
    name: 'my-plugin',
    description: 'A description of my plugin',
    author: 'My Name',
    plugins: [typescript()]
};
```

## Notes

Because of the way the bundler works, if you want to export an onStop function, you should export it from within your input file. Otherwise, it will get tree-shaken away.