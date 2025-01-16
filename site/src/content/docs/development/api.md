---
title: The Gimloader Api
description: An overview of the Gimloader api
---

The Gimloader API is accessible through the global `GL` object. It contains many tools that are useful for making scripts.

## Scoped vs. Unscoped

It is recommended that you use the scoped api for your script, as it will automatically handle cleaning up any changes that have been made when the script is disabled. The global api requires using an id for cleanup, which can be cumbersome. In order to create a scoped API, simply run `const api = new GL()` within a script.

```js
// Unscoped
GL.UI.addStyles("MyPlugin", "#thing { color: red }");

export function onStop() {
    GL.UI.removeStyles("MyPlugin");
}

// Scoped
const api = new GL();
api.UI.addStyles("#thing { color: red }")
```

When using the scoped api, rather than exporting `onStop` and `openSettingsMenu` it is recommended that you use `api.onStop` and `api.openSettingsMenu`, like so:
```js
const api = new GL();
api.onStop(() => console.log("Stopping!"));
api.openSettingsMenu(() => api.UI.showModal(...))
```

## Important API Elements

Obviously, the entire API can't be included here. See the docs for the [scoped](../api/scopedapi) and [unscoped](../api/scoped) apis if you want that. Below are some of the things that will be most useful to a new dev.

### GL.stores

`GL.stores` is by far the most important thing which Gimloader provides. `stores` is an internal variable which contains nearly everything going on within 2d Gimkit gamemodes (it does not exist in classic modes). It is undocumented, so it is recommended that you familiarize yourself with it by typing `GL.stores` in your browser console and looking around.

#### GL.stores.phaser.mainCharacter

This is the object that represents the character the player controls. The character's coordinates can be found at `mainCharacter.body.x` and `mainCharacter.body.y`, and most things related to visuals are present. For example, the player's skin can be updated client-side to the unobtainable [Clown](https://gimkit.wiki/wiki/Clown) skin by running the following:

```js
GL.stores.phaser.mainCharacter.skin.updateSkin({ id: "clown" });
```

#### GL.stores.phaser.scene.worldManager

The world manager is responsible for several things, notably devices. Plugins are able to see devices in `worldManager.devices.allDevices`, and they can be triggered by doing `device.interactiveZones.onInteraction()`.

#### GL.stores.me

This contains a variety of things, but one of the more important ones is the player's inventory at `me.inventory`.

### GL.net.room.state

Once again, this is only available in 2d modes. The `state` contains everything that is synchronised between the client and the server. Gimkit uses [Colyseus.js](https://colyseus.io) for this, and information on listening to changes can be found in their [docs](https://docs.colyseus.io/state/schema-callbacks/). For example, `state.session.phase` shows whether the game is currently active or in the lobby.