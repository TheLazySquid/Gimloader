---
title: Plugins Api
description: Documentation for the Plugins Api
---
# [GL](./api).plugins

## Accessors

### list

#### Get Signature

> **get** **list**(): `string`[]

A list of all the plugins installed

##### Returns

`string`[]

## Methods

### get()

> **get**(`name`): `any`

Gets the exported values of a plugin, if it has been enabled

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `name` | `string` |

#### Returns

`any`

***

### getHeaders()

> **getHeaders**(`name`): `object`

Gets the headers of a plugin, such as version, author, and description

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `name` | `string` |

#### Returns

`object`

***

### isEnabled()

> **isEnabled**(`name`): `boolean`

Whether a plugin exists and is enabled

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `name` | `string` |

#### Returns

`boolean`
