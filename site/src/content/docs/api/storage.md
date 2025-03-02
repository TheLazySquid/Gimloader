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

### offAllChanges()

> **offAllChanges**(`pluginName`): `void`

Removes all listeners added by onChange for a certain plugin

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `pluginName` | `string` |

#### Returns

`void`

***

### offChange()

> **offChange**(`pluginName`, `key`, `callback`): `void`

Removes a listener added by onChange

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `pluginName` | `string` |
| `key` | `string` |
| `callback` | (`value`, `remote`) => `void` |

#### Returns

`void`

***

### onChange()

> **onChange**(`pluginName`, `key`, `callback`): () => `void`

Adds a listener for when a plugin's stored value with a certain key changes

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `pluginName` | `string` |
| `key` | `string` |
| `callback` | (`value`, `remote`) => `void` |

#### Returns

`Function`

##### Returns

`void`

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
