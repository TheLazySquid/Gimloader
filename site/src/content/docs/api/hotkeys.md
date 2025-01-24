---
title: Hotkeys Api
description: Documentation for the Hotkeys Api
---
# [GL](./api).hotkeys

## Accessors

### pressed

#### Get Signature

> **get** **pressed**(): `Set`\<`string`\>

Which key codes are currently being pressed

##### Returns

`Set`\<`string`\>

## Methods

### addConfigurableHotkey()

> **addConfigurableHotkey**(`id`, `options`, `callback`): () => `void`

Adds a hotkey which can be changed by the user

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `id` | `string` | A unique id for the hotkey, such as `myplugin-myhotkey` |
| `options` | \{ `category`: `string`; `default`: \{ `alt`: `boolean`; `ctrl`: `boolean`; `key`: `string`; `keys`: `string`[]; `shift`: `boolean`; \}; `preventDefault`: `boolean`; `title`: `string`; \} | - |
| `options.category` | `string` | - |
| `options.default`? | \{ `alt`: `boolean`; `ctrl`: `boolean`; `key`: `string`; `keys`: `string`[]; `shift`: `boolean`; \} | - |
| `options.default.alt`? | `boolean` | - |
| `options.default.ctrl`? | `boolean` | - |
| `options.default.key`? | `string` | Should be a keyboardevent [code](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code) |
| `options.default.keys`? | `string`[] | Should be keyboardevent [codes](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code) |
| `options.default.shift`? | `boolean` | - |
| `options.preventDefault`? | `boolean` | - |
| `options.title` | `string` | There should be no duplicate titles within a category |
| `callback` | (`e`) => `void` | - |

#### Returns

`Function`

A function to remove the hotkey

##### Returns

`void`

***

### addHotkey()

> **addHotkey**(`id`, `options`, `callback`): () => `void`

Adds a hotkey with a given id

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `id` | `string` | - |
| `options` | \{ `alt`: `boolean`; `ctrl`: `boolean`; `key`: `string`; `keys`: `string`[]; `preventDefault`: `boolean`; `shift`: `boolean`; \} | - |
| `options.alt`? | `boolean` | - |
| `options.ctrl`? | `boolean` | - |
| `options.key`? | `string` | Should be a keyboardevent [code](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code) |
| `options.keys`? | `string`[] | Should be keyboardevent [codes](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code) |
| `options.preventDefault`? | `boolean` | - |
| `options.shift`? | `boolean` | - |
| `callback` | (`e`) => `void` | - |

#### Returns

`Function`

A function to remove the hotkey

##### Returns

`void`

***

### releaseAll()

> **releaseAll**(): `void`

Releases all keys, needed if a hotkey opens something that will
prevent keyup events from being registered, such as an alert

#### Returns

`void`

***

### removeConfigurableHotkey()

> **removeConfigurableHotkey**(`id`): `void`

Removes a configurable hotkey with a given id

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `id` | `string` |

#### Returns

`void`

***

### removeHotkeys()

> **removeHotkeys**(`id`): `void`

Removes all hotkeys with a given id

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `id` | `string` |

#### Returns

`void`
