---
title: Scoped UI Api
description: Documentation for the Scoped UI Api
---
# [ScopedApi](./scopedapi).ui

## Methods

### addStyles()

> **addStyles**(`style`): () => `void`

Adds a style to the DOM

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `style` | `string` |

#### Returns

`Function`

A function to remove the styles

##### Returns

`void`

***

### showModal()

> **showModal**(`element`, `options`): `void`

Shows a customizable modal to the user

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `element` | `HTMLElement` \| `ReactElement` |
| `options` | `Partial`\<\{ `buttons`: `ModalButton`[]; `className`: `string`; `closeOnBackgroundClick`: `boolean`; `id`: `string`; `onClosed`: () => `void`; `style`: `string`; `title`: `string`; \}\> |

#### Returns

`void`
