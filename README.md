# Gimloader

This is a Gimkit plugin loader and manager, based on a trick first used in [Gimhook](https://codeberg.org/gimhook/gimhook) with an API inspired by [BetterDiscord](https://docs.betterdiscord.app/api/).

## Installation

1. Install [Tampermonkey](https://www.tampermonkey.net/) for your browser.
2. Click on [this link](https://raw.githubusercontent.com/TheLazySquid/GimLoader/main/build/bundle.user.js)

## Usage

At any point, you can open the mod menu by pressing `alt + p`.

<details>
<summary>I also painstakingly added buttons on every screen I could think of.</summary>

![1d host lobby](/images/1dHost.png)
![1d host in game](/images/1dHostIngame.png)
![1d player in game](/images/1dIngame.png)
![1d player lobby](/images/1dJoin.png)
![2d host](/images/2dHost.png)
![2d player](/images/2dPlayer.png)
![Creative](/images/Creative.png)
![Home](/images/HomeScreen.png)
![Join Screen](/images/JoinScreen.png)

</details>

Once in the mod menu, you can create or import plugins with the two buttons at the top. There are some example plugins [here](/plugins/).

## Known Issues

Sometimes the script will not get loaded in time to intercept some important modules, which can prevent some plugins from work. I'm trying to come up with a solution, but for now please hang tight.

## Development

### Plugin Structure

Plugins should start with a jsdoc comment that looks like this to give some information about the plugin:

```javascript
/**
 * @name Plugin Name
 * @description A description of the plugin
 * @author Your Name
 */
```

Additionally, if your plugin requires cleanup when turned off please export a function called onStop, like so:

```javascript
export function onStop() {
  // clean up whatever you need to here
}
```

### Plugin API

When using Gimloader, a global `GL` object is added to the window. Right now, this has a few utility functions:

### GL.React, GL.ReactDOM, GL.notification

These are the [React](https://react.dev/reference/react), [ReactDOM](https://react.dev/reference/react-dom) and [ant-design notification](https://ant.design/components/notification) instances that are used by Gimkit.

### GL.stores, GL.platformerPhysics

These are both internal Gimkit modules that are used in 2d gamemodes and contain a a lot of useful stuff about the current game state.

### GL.parcel

`GL.parcel.interceptRequire(id: string | null, match(exports: any) => boolean, (exports: any) => any, once: boolean): () => void`

Whenever a module is imported by Gimkit that has exports that match the second argument, the third argument will be called with the exports. Returning something from the callback will modify the exports of the module. Requires an ID to be used for when the plugin is unloaded. Returns a function that will remove the interceptor. If once is true, the interceptor will only fire once.

`GL.parcel.stopIntercepts(id: string)`

Removes all interceptors with the given ID. You should use this in your onStop function if you added any interceptors.

### GL.net

GL.net has three transports: Colyseus, Blueboat and active, which is the transport that Gimkit is currently using. Be warned: active may be null if Gimkit is not currently using a transport. Colyseus is used for 2d gamemodes, and Blueboat is used for "1d" (classic) gamemodes.

`GL.net.[transport].room`

The room for the transport (if any) that Gimkit is currently using

`GL.net.[transport].addEventListener(channel: string, (data: CustomEvent<any>) => void)`

Fires whenever a message is sent on a specific channel.

`GL.net.[transport].addEventListener(channel: "*", (data: CustomEvent<{ channel: string, message: any }>) => void)`

Fires whenever a message is sent on any channel.

`GL.net.[transport].send(channel: string, message: any)`

Sends a message on a specific channel.

### GL.hotkeys

`GL.hotkeys.add(keys: Set<string>, callback: (e: KeyboardEvent) => void, preventDefault?: boolean)`

Adds a hotkey to be called whenever all the keys are pressed. The keys MUST be in lowercase. If you pass in preventDefault, event.preventDefault() will be called automatically. This defaults to true. If you mutate the keys set you passed in, the hotkey will be updated accordingly.

`GL.hotkeys.remove(keys: Set<string>)`

Removes a hotkey.

### GL.UI

`GL.UI.showModal(element: ReactElement | HTMLElement, options?: object)`

Shows a customizable modal with the given element as the content. It accepts the following options:

- `title`: The title of the modal
- `style`: A string of any styles you want to apply to the modal
- `className`: A class to add to the modal
- `closeOnBackgroundClick`: Whether or not the modal should close when the background is clicked
- `buttons`: A list of buttons that will close the modal. A button is an object with the following properties:
  - `text`: The text of the button
  - `onClick`: A function to call when the button is clicked
  - `style`: Either "primary", "danger" or "close". This will apply styles to the button.
- `onClose`: A function to call when the modal is closed

`GL.UI.addStyle(id: string, style: string)`

Adds a style to the page with a given id. There can be multiple styles with the same id.

`GL.UI.removeStyle(id: string)`

Removes all styles with the given id. Mostly used for cleanup.

### GL.patcher

This patcher API is inspired by [BetterDiscord's Patcher](https://docs.betterdiscord.app/api/patcher). It allows you to patch functions on objects, which is most useful for modifying what modules export.

`GL.patcher.after(id: string | null, object: object, method: string, callback: (this: any, ...args: IArguments[], returnVal: any) => any): () => void`

After the method to patch is called, the callback will be called, which allows you to edit the return value to your liking. Requires an ID to be used for when the plugin is unloaded. Returns a function that will remove the patch.

`GL.patcher.before(id: string | null, object: object, method: string, callback: (this: any, ...args: IArguments[]) => any): () => void`

Before the patched method is run you are given the arguments that will be passed to the method. You can modify these arguments and they will be passed to the method. 

`GL.patcher.instead(id: string | null, object: object, method: string, callback: (this: any, ...args: IArguments[]) => any): () => void`

Instead of the method being called, the callback will be called. This is useful for when you want to completely replace a method.

`GL.patcher.unpatchAll(id: string)`

Removes all patches with a given ID. You should use this in your onStop function if you added any patches.

### Events

Gimloader also has a few events that you can listen to:

`GL.addEventListener("loadStart", () => void)`

Fires when Gimkit begins loading into a game.

`GL.addEventListener("loadEnd", () => void)`

Fires when the load is complete.

### Types

To use types for Gimloader, run the following:

```bash
npm install -D @types/gimloader@github:TheLazySquid/GimLoader
```

## Plans

I plan to add compatibility for [gimhook](https://codeberg.org/gimhook/gimhook) mods in the future. I also hope to expand the utility functions that this offers.