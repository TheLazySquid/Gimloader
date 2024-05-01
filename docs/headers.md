## Plugin Headers

At the top of your plugin you should include a jsdoc comment to give Gimloader some information about the plugin. This isn't mandatory, to keep compatibility with window.stores mods, but it is heavily recommended. Here is an example with all the possible fields:

```javascript
/**
 * @name Plugin Name
 * @description A description of the plugin
 * @author Your Name
 * @version 1.0.0
 * @reloadRequired true
 */
```

The fields are as follows:

- `name`: The name of the plugin. This is displayed in the plugin list, and will the the name of the file generated with the [build tools](./buildTools.md).
- `description`: A description of the plugin. This is displayed in the plugin list.
- `author`: The author of the plugin. This is displayed in the plugin list.
- `version`: The version of the plugin. This is optional, and has no effect on the plugin. Is displayed in the plugin list.
- `reloadRequired`: Whether or not the plugin requires a reload to take effect. This is optional, and defaults to false. If set to true, the user will be prompted to reload their page when the plugin is enabled.