# Gimloader

This is a Gimkit plugin loader and manager, based on a trick first used in [Gimhook](https://codeberg.org/gimhook/gimhook) with an API inspired by [BetterDiscord](https://docs.betterdiscord.app/api/).

## Installation

1. Install [ViolentMonkey](https://violentmonkey.github.io/get-it/) for your browser.
2. Click on [this link](https://raw.githubusercontent.com/TheLazySquid/GimLoader/main/build/bundle.user.js)
3. Go to [gimkit.com/join](https://www.gimkit.com/join) and there should be a wrench icon next to the join button.

![UI Preview](/images/UIPreview.png)

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

These buttons can be disabled in the settings section.

Once in the mod menu, you can create or import plugins with the two buttons at the top. There are some example plugins [here](/plugins/). Some plugins depend on libraries, which you can manage in the libraries tab. Some plugins may also add hotkeys that you can change, which will be in the hotkeys tab.

## Gimhook Compatibility

Gimloader has a polyfill to allow for Gimhook mods to work with it. If you have a Gimhook mod that doesn't work with Gimloader, please open an issue.

## Development

Information on developing plugins can be found in [the wiki](https://github.com/TheLazySquid/Gimloader/wiki/Plugin-Development).