# Gimloader

This is a Gimkit plugin loader and manager, based on a trick first used in [Gimhook](https://codeberg.org/gimhook/gimhook) with an API inspired by [BetterDiscord](https://docs.betterdiscord.app/api/).

## Installation

1. Install [ViolentMonkey](https://violentmonkey.github.io/get-it/) for your browser.
2. Click on [this link](https://raw.githubusercontent.com/TheLazySquid/GimLoader/main/build/bundle.user.js)
3. Go to [gimkit.com/join](https://www.gimkit.com/join) and there should be a wrench icon next to the join button.

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

You can check for updates to the modloader with the update button at the top left. If it is the first time you do this, Tampermonkey will ask whether to allow Gimloader to use cross-origin resources. Hit "Always allow" so you don't have to do this every time.

## Gimhook Compatibility

Gimloader has a polyfill to allow for Gimhook mods to work with it. If you have a Gimhook mod that doesn't work with Gimloader, please open an issue.

## Development

### Plugin Structure

Plugins should start with a jsdoc comment that looks like this to give some information about the plugin (more info [here](https://github.com/TheLazySquid/Gimloader/wiki/Plugin-and-Library-Headers)).

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

### API

The api reference can be found [here](https://github.com/TheLazySquid/Gimloader/wiki/Plugin-API).

### Build Tools

Gimloader provides an easy way to build more complex plugins. Find more information [here](https://github.com/TheLazySquid/Gimloader/wiki/Build-Tools).

### Types

When using gimloader for a project, toss this somewhere in your project to get types for the api:

```typescript
/// <reference types="gimloader" />
```