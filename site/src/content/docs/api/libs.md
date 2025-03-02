---
title: Libs Api
description: Documentation for the Libs Api
---
# [GL](./api).libs

## Accessors

### list

#### Get Signature

> **get** **list**(): `string`[]

A list of all the libraries installed

##### Returns

`string`[]

## Methods

### get()

> **get**(`name`): `any`

Gets the exported values of a library

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `name` | `string` |

#### Returns

`any`

***

### getHeaders()

> **getHeaders**(`name`): `object`

Gets the headers of a library, such as version, author, and description

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `name` | `string` |

#### Returns

`object`

##### author

> **author**: `string`

##### description

> **description**: `string`

##### downloadUrl

> **downloadUrl**: `string`

##### isLibrary

> **isLibrary**: `string`

##### name

> **name**: `string`

##### reloadRequired

> **reloadRequired**: `string`

##### version

> **version**: `string`

##### webpage

> **webpage**: `string`

***

### isEnabled()

> **isEnabled**(`name`): `boolean`

Gets whether or not a plugin is installed and enabled

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `name` | `string` |

#### Returns

`boolean`
