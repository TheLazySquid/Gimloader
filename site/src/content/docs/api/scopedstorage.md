---
title: Scoped Storage Api
description: Documentation for the Scoped Storage Api
---
# [ScopedApi](./scopedapi).storage

## Methods

### deleteValue()

> **deleteValue**(`key`): `void`

Removes a value which has been saved

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |

#### Returns

`void`

***

### getValue()

> **getValue**(`key`, `defaultValue`?): `any`

Gets a value that has previously been saved

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |
| `defaultValue`? | `any` |

#### Returns

`any`

***

### setValue()

> **setValue**(`key`, `value`): `void`

Sets a value which can be retrieved later, persisting through reloads

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |
| `value` | `any` |

#### Returns

`void`
