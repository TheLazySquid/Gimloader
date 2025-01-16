---
title: Scoped Net Api
description: Documentation for the Scoped Net Api
---
# [ScopedApi](./scopedapi).net

The net api extends [EventEmitter2](https://github.com/EventEmitter2/EventEmitter2)
and uses wildcards with ":" as a delimiter.

The following events are emitted:

```ts
// fired when data is recieved on a certain channel
net.on(CHANNEL, (data, editFn) => {})

// fired when data is sent on a certain channel
net.on(send:CHANNEL, (data, editFn) => {})

// fired when the game loads with a certain type
net.on(load:TYPE, (type) => {})

// you can also use wildcards, eg
net.on("send:*", () => {})
```

## Properties

### corsRequest()

> **corsRequest**: \<`TContext`\>(`details`) => `Promise`\<`Response`\<`TContext`\>\> = `Net.corsRequest`

The userscript manager's xmlHttpRequest, which bypasses the CSP

Makes an xmlHttpRequest

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `TContext` | `any` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `details` | `Request`\<`TContext`\> |

#### Returns

`Promise`\<`Response`\<`TContext`\>\>

#### Throws

## Accessors

### isHost

#### Get Signature

> **get** **isHost**(): `any`

Whether the user is the one hosting the current game

##### Returns

`any`

***

### room

#### Get Signature

> **get** **room**(): `any`

The room that the client is connected to, or null if there is no connection

##### Returns

`any`

***

### type

#### Get Signature

> **get** **type**(): `"Blueboat"` \| `"Colyseus"` \| `"None"`

Which type of server the client is currently connected to

##### Returns

`"Blueboat"` \| `"Colyseus"` \| `"None"`

## Methods

### onLoad()

> **onLoad**(`callback`): () => `void`

Runs a callback when the game is loaded, or runs it immediately if the game has already loaded

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `callback` | (`type`) => `void` |

#### Returns

`Function`

A function to cancel waiting for load

##### Returns

`void`

***

### send()

> **send**(`channel`, `message`): `void`

Sends a message to the server on a specific channel

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `channel` | `string` |
| `message` | `any` |

#### Returns

`void`
