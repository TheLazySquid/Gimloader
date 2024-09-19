# QuickSettings

QuickSettings is a library to easily make simple settings menus.

## Example Plugin

```js
/**
 * ...
 * @needsLib QuickSettings | https://raw.githubusercontent.com/TheLazySquid/Gimloader/refs/heads/main/libraries/QuickSettings/build/QuickSettings.js
 */

let settings = GL.lib("QuickSettings")("MyLib", [
    {
        type: "heading",
        text: "Some Settings"
    },
    {
        type: "boolean",
        id: "bool",
        title: "A boolean!",
        default: true
    },
    {
        type: "number",
        id: "num",
        title: "A number!",
        default: 10,
        min: 0,
        max: 100,
        step: 1
    },
    {
        type: "text",
        id: "name",
        title: "Your name",
        maxLength: 18,
        default: "Josh"
    }
]);

settings.listen("bool", (val) => console.log("bool changed to", val));
settings.listen("num", (val) => console.log("num changed to", val));
settings.listen("name", (val) => console.log("name changed to", val));

console.log("The boolean is", settings.bool);
console.log("The number is", settings.num);
console.log("The name is", settings.name);

export const openSettingsMenu = settings.openSettingsMenu;
```

## Usage
`GL.lib("QuickSettings")` returns a function which is used to create the settings object. It takes the name of the plugin calling it and an array of elements in the settings menu.

In order to enable the settings menu you need to add the following to the end of your plugin.

```js
export const openSettingsMenu = settings.openSettingsMenu;
```

### Elements

Elements are an object with a set `type`. All elements other than heading require a `title` (which is displayed) and an `id` (which is used to get the settings).

#### Heading properties

```ts
type: "heading",
text: string
```

#### Boolean properties

```ts
type: "boolean",
title: string,
id: string,
default?: boolean
```

#### Number properties

```ts
type: "boolean",
title: string,
id: string,
default?: boolean,
min?: number,
max?: number,
step?: number
```

#### Text properties

```ts
type: "boolean",
title: string,
id: string,
default?: string,
maxLength?: number
```

### Getting settings
You can get the value of a setting by its `id` on the settings object.


```js
let settings = GL.lib("QuickSettings")("...", [{
    type: "boolean",
    title: "A Boolean",
    id: "bool"
}])

console.log(settings.bool) // true or false
```

### Listening to changes
The settings object has a listen function that takes the setting's `id` and a callback when it changes. (Does not fire when initially added).
```js
let settings = GL.lib("QuickSettings")("...", [{
    type: "boolean",
    title: "A Boolean",
    id: "bool"
}])

// logs true/false when the setting is changed
settings.listen("bool", (val) => console.log(val));
```