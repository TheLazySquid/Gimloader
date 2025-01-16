---
title: Scoped Patcher Api
description: Documentation for the Scoped Patcher Api
---
# [ScopedApi](./scopedapi).patcher

## Methods

### after()

> **after**(`object`, `method`, `callback`): () => `void`

Runs a callback after a function on an object has been run

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `object` | `any` |
| `method` | `string` |
| `callback` | (`thisVal`, `args`, `returnVal`) => `any` |

#### Returns

`Function`

A function to remove the patch

##### Returns

`void`

***

### before()

> **before**(`object`, `method`, `callback`): () => `void`

Runs a callback before a function on an object has been run.
Return true from the callback to prevent the function from running

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `object` | `any` |
| `method` | `string` |
| `callback` | (`thisVal`, `args`) => `boolean` \| `void` |

#### Returns

`Function`

A function to remove the patch

##### Returns

`void`

***

### instead()

> **instead**(`object`, `method`, `callback`): () => `void`

Runs a function instead of a function on an object

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `object` | `any` |
| `method` | `string` |
| `callback` | (`thisVal`, `args`) => `void` |

#### Returns

`Function`

A function to remove the patch

##### Returns

`void`
