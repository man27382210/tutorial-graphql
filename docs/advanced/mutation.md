# Mutation

For this tutorial, we will introduce another important feature call `Mutation` in GraphQL and implementation in Apollo Client / Relay

## Overview

- [Mutation](#mutation)
  - [Overview](#overview)
  - [Preparation](#preparation)
  - [Look to the code](#look-to-the-code)
    - [Target](#target)

## Preparation

Start GraphQL server

```
$ cd graphQL-server && yarn run start
```

Start Apollo mutation example client server

```
$ cd ./mutation-apollo && yarn run start
```

It will run on [localhost:4001](localhost:4001)

## Look to the code

### Target

Add two input fields for add new message, once click the submit button should send data to  server side and update UI.

### Mutation Schema

```
// ./mutation/mutation-apollo/src/component/mutation.ts

import gql from 'graphql-tag'

export const createMessageSchema = gql`
  mutation CreateMessageMutation($input: MessageInput!) {
    createMessage(input: $input) {
      messageEdge {
        node {
          id
          content
          author
        }
      }
    }
  }
`
```

`CreateMessageMutation` is operation name and `$input: MessageInput!` is input variable with `MessageInput`, `!` means required.

`createMessage` is mutation name and
```
{
  messageEdge {
    node {
      id
      content
      author
    }
  }
}
```
is callback result data structure.

Open [GraphQL dashboard](http://localhost:4000/graphql) and play with mutation a little bit,
input string below in left screen and press play button.

```
mutation {
  createMessage(input: {author: "Davis", content: "Hellooooo"}) {
    messageEdge {
      cursor
      node {
        author
        content
        id
      }
    }
  }
}
```
We can get the result in right screen as below:

```
{
  "data": {
    "createMessage": {
      "messageEdge": {
        "cursor": "d7949fe9fea1f65ed860",
        "node": {
          "author": "Davis",
          "content": "Hellooooo",
          "id": "d7949fe9fea1f65ed860"
        }
      }
    }
  }
}
```

You can also add console in server side to check server really catch the data.

```
Mutation: {
  createMessage: function (__, { input }) {
  	var id = createId()
  	fakeDatabase.push({id, ...input})
  	console.log(fakeDatabase)
  	fakeDatabaseIndexObj[id] = fakeDatabase.length
  	return {messageEdge: {cursor: id, node: new Message(id, input)}}
  },
}
```
```
// console.log(fakeDatabase)
 [
    ...
    {
      "node": {
        "author": "Davis",
        "content": "init content7",
        "id": "8893930c48ee96d49e1c"
      }
    },
    {
      "node": {
        "author": "Davis",
        "content": "Hellooooo",
        "id": "d7949fe9fea1f65ed860"
      }
    }
 ]
```
Our new message really send to server side and add into database, the next step is we need to update the UI with callback data.

### Update UI

There is a feature that `Apollo client` and `Relay` both provided, call `optimisticResponse`.
Means both framework support us to put a fake data on UI before get the real callback data, it's very common feature to see on facebook, twitter...etc (like press like on a post, UI will increase the count of like even the post is not really send to server, of course you don't really need to implement this feature, but UI might looks a little wired).

#### Apollo Client

Open `./mutation/mutation-apollo`.

##### Generate type

Before we do the React code, we need to prepare schema and update type again.

- Prepare `mutation.ts` (here we have `./mutation/mutation-apollo/src/component/mutation.ts`)
- `npm run type`, `apollo client:codegen` will help us to generate type under `./mutation/mutation-apollo/src/component/--schema/`

##### Mutation React Component

```
// 
```

#### Relay

