---
title: Unscoped Api
description: Documentation for the Unscoped Api
---
The api is accessible via the global variable `GL`. Scripts are also able to use a [scoped API](./scopedapi) which automatically handles cleanup by creating a `new GL()`
## Properties



### hotkeys

> `static` **hotkeys**: `Readonly`\<[`HotkeysApi`](/Gimloader/api/hotkeys)\>

Functions to listen for key combinations

***

### lib()

> `static` **lib**: (`name`) => `any`

Gets the exported values of a library

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `name` | `string` |

#### Returns

`any`

***

### libs

> `static` **libs**: `Readonly`\<[`LibsApi`](/Gimloader/api/libs)\>

Methods for getting info on libraries

***

### net

> `static` **net**: `Readonly`\<[`NetApi`](/Gimloader/api/net) & `Connection`\>

Ways to interact with the current connection to the server,
and functions to send general requests

***

### parcel

> `static` **parcel**: `Readonly`\<[`ParcelApi`](/Gimloader/api/parcel)\>

Functions used to modify Gimkit's internal modules

***

### patcher

> `static` **patcher**: `Readonly`\<[`PatcherApi`](/Gimloader/api/patcher)\>

Functions for intercepting the arguments and return values of functions

***

### plugin()

> `static` **plugin**: (`name`) => `any`

Gets the exported values of a plugin, if it has been enabled

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `name` | `string` |

#### Returns

`any`

***

### plugins

> `static` **plugins**: `Readonly`\<[`PluginsApi`](/Gimloader/api/plugins)\>

Methods for getting info on plugins

***

### storage

> `static` **storage**: `Readonly`\<[`StorageApi`](/Gimloader/api/storage)\>

Functions for persisting data between reloads

***

### UI

> `static` **UI**: `Readonly`\<[`UIApi`](/Gimloader/api/ui)\>

Functions for interacting with the DOM

## Accessors



### notification

#### Get Signature

> **get** `static` **notification**(): `any`

Gimkit's notification object, only available when joining or playing a game

[https://ant.design/components/notification](https://ant.design/components/notification)

##### Returns

`any`

***

### React

#### Get Signature

> **get** `static` **React**(): *typeof* `React`

Gimkit's internal react instance

##### Returns

*typeof* `React`

***

### ReactDOM

#### Get Signature

> **get** `static` **ReactDOM**(): `__module`

Gimkit's internal reactDom instance

##### Returns

`__module`

***

### stores

#### Get Signature

> **get** `static` **stores**(): `any`

A variety of Gimkit internal objects available in 2d gamemodes

##### Returns

`any`
