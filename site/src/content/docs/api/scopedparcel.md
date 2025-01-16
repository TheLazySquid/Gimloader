---
title: Scoped Parcel Api
description: Documentation for the Scoped Parcel Api
---
# [ScopedApi](./scopedapi).parcel

## Methods

### getLazy()

> **getLazy**(`matcher`, `callback`, `initial`): () => `void`

Waits for a module to be loaded, then runs a callback

#### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
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
