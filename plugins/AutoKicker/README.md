# AutoKicker

This is a plugin that allows you to set rules that allow you to automatically kick players / bots from your game.

## Installation

Click [here](https://thelazysquid.github.io/gimloader/?installUrl=https://raw.githubusercontent.com/TheLazySquid/Gimloader/main/plugins/AutoKicker/build/AutoKicker.js) to install the plugin with Gimloader downloaded.

## Usage

When you join a game as the host, a UI will appear in the top left. This allows you to set three rules, as well as make a name blacklist. These rules are:

- Kick duplicates: Kick players that have the same names as 2+ other players. Trailing numbers are ignored.
- Kick skinless: Kick players that have the default skin
- Kick idle: Kick players that have not moved since joining or the setting being turned on. Has a configurable time limit.

You can also set up a blacklist, which allows you to automatically kick players with certain names. This is case-insensitive. You can configure whether each rule is exact or partial, and trailing numbers are ignored.

The UI can be shown or hidden by pressing `alt + k`.