---
title: Development Overview
description: An overview of developing Gimloader scripts
prev: false
---

## Introduction

Gimloader scripts are just javascript that is run by Gimloader. They can use the Gimloader [Api](../api/api), accessible through the global `GL` object, to access various internal parts of Gimkit. These scripts are organized into two different types: Plugins and Libraries. Plugins are individual scripts that the user can enable and disable to modify their game. Libraries provide utility functions to plugins, and cannot be directly enabled or disabled by the user.

This introduction assumes you have a solid grasp on Javascript. If you're unfamiliar with it, there are many resources available online to help get you started.

## Example Plugin

```js
/**
 * @name Example
 * @description This is a simple plugin
 * @author Tutorial
 */

const api = new GL();

api.net.onLoad(() => {
    api.hotkeys.addHotkey({ key: "KeyQ" }, () => {
        GL.notification.open({ message: "Q pressed!" });
    });
});
```