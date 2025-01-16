---
title: UI Api
description: Documentation for the UI Api
---
# [GL](./api).ui

## Methods

### addStyles()

> **addStyles**(`id`, `style`): () => `void`

Adds a style to the DOM

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `id` | `string` |
| `style` | `string` |

#### Returns

`Function`

A function to remove the styles

##### Returns

`void`

***

### removeStyles()

> **removeStyles**(`id`): `void`

Remove all styles with a given id

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `id` | `string` |

#### Returns

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
