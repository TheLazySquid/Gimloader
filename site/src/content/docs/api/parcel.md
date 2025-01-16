---
title: Parcel Api
description: Documentation for the Parcel Api
---
# [GL](./api).parcel

## Methods

### getLazy()

> **getLazy**(`id`, `matcher`, `callback`, `initial`): () => `void`

Waits for a module to be loaded, then runs a callback

#### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `id` | `string` | `undefined` |
| `matcher` | (`exports`, `id`) => `boolean` | `undefined` |
| `callback` | (`exports`) => `any` | `undefined` |
| `initial` | `boolean` | `true` |

#### Returns

`Function`

A function to cancel waiting for the module

##### Returns

`void`

***

### query()

> **query**(`matcher`): `any`

Gets a module based on a filter, returns null if none are found
Be cautious when using this- plugins will often run before any modules load in,
meaning that if this is run on startup it will likely return nothing.
Consider using getLazy instead.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `matcher` | (`exports`, `id`) => `boolean` |

#### Returns

`any`

***

### queryAll()

> **queryAll**(`matcher`): `any`[]

Returns an array of all loaded modules matching a filter
Be cautious when using this- plugins will often run before any modules load in,
meaning that if this is run on startup it will likely return nothing.
Consider using getLazy instead.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `matcher` | (`exports`, `id`) => `boolean` |

#### Returns

`any`[]

***

### stopLazy()

> **stopLazy**(`id`): `void`

Cancels any calls to getLazy with the same id

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `id` | `string` |

#### Returns

`void`
