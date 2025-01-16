---
title: Storage Api
description: Documentation for the Storage Api
---
# [GL](./api).storage

## Methods

### deleteValue()

> **deleteValue**(`pluginName`, `key`): `void`

Removes a value which has been saved

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `pluginName` | `string` |
| `key` | `string` |

#### Returns

`void`

***

### getValue()

> **getValue**(`pluginName`, `key`, `defaultValue`?): `any`

Gets a value that has previously been saved

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `pluginName` | `string` |
| `key` | `string` |
| `defaultValue`? | `any` |

#### Returns

`any`

***

### setValue()

> **setValue**(`pluginName`, `key`, `value`): `void`

Sets a value which can be retrieved later, through reloads

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `pluginName` | `string` |
| `key` | `string` |
| `value` | `any` |

#### Returns

`void`
