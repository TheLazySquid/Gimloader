---
title: Gimkit's Internals
description: An overview of important libraries Gimkit uses
---

In order to be able to effectively make scripts it's important to understand what Gimkit uses so you can leverage its documentation rather that attempting to reverse engineer everything on your own.

## Important Libraries

| Library | Purpose |
| ------- | ------- |
| [Phaser](https://phaser.io/) | Game framework |
| [Colyseus](https://colyseus.io/) | Networking for 2d gamemodes |
| [Spine](https://esotericsoftware.com/) | Characters in 2d modes |
| [Compress-Json](https://github.com/beenotung/compress-json) | Characters are compressed using this library |
| [React](https://react.dev/) | UI Framework |
| [Ant Design](https://ant.design) | UI Components |
| [Font Awesome](https://fontawesome.com/) | Icons |
| [Mobx](https://mobx.js.org/) | State management |
| [Blueboat](https://github.com/Gimkit/blueboat) | Networking for 1d games |

There are plenty of others for smaller tasks like encrypting strings or determining whether a color is light or dark, but those are the more important ones.