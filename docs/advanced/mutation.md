# Mutation

For this tutorial, we will introduce another important feature call `Mutation` in GraphQL and implementation in Apollo Client / Relay

## Overview

- [Mutation](#mutation)
  - [Overview](##overview)
  - [Preparation](##preparation)
  - [Look to the code](##look-to-the-code)
  - [Summary](#Summary)

## Preparation

Start GraphQL server

```
$ cd graphQL-server && yarn run start
```

Start Apollo mutation example client server

```
$ cd ./mutation/mutation-apollo && yarn run start
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

Back to React word, there is two basic ideal share both `Apollo client` and `Relay`:

 - Update cache with mutation callback data.
 - Use `optimisticResponse` to mock a fake data on UI before real mutation callback.

Both `Apollo client` and `Relay` provide `optimisticResponse`, it's very common feature to see on facebook, twitter...etc ( like press `like` on a post, UI will increase the count of like even the post is not really send to server ).

#### Apollo Client

Open `./mutation/mutation-apollo`.

##### Generate type

Before we do the React code, we need to prepare schema and update type again.

- Prepare `mutation.ts` (here we have `./mutation/mutation-apollo/src/component/mutation.ts`)
- `npm run type`, `apollo client:codegen` will help us to generate type under `./mutation/mutation-apollo/src/component/--schema/`

##### Mutation React Component

```
// ./mutation/mutation-apollo/src/component/CreateMessage.tsx

import * as React from 'react'
import { Mutation, MutationFn } from 'react-apollo'
import { DataProxy } from 'apollo-cache'
import { createMessageSchema } from './mutation'
import { messageQUERY } from './queries'
import {
  CreateMessageMutation,
  CreateMessageMutationVariables,
} from './--schema/CreateMessageMutation'

import { GetMessage } from './--schema/GetMessage'

class MutationMessage extends Mutation<CreateMessageMutation, CreateMessageMutationVariables> {}

const updateFucntion = (cache: DataProxy, mutationResult: { data: CreateMessageMutation }) => {
  const { createMessage } = mutationResult.data
  try {
    const queryData = cache.readQuery({ query: messageQUERY }) as GetMessage
    if (!queryData || !queryData.getMessage || !queryData.getMessage.edges || !createMessage) return
    queryData.getMessage.edges.push(createMessage.messageEdge)
    cache.writeQuery({
      query: messageQUERY,
      data: { getMessage: queryData.getMessage },
    })
  } catch (e) {
    console.log('cache no update')
  }
}

export class CreateMessage extends React.Component {
  authorRef = React.createRef<HTMLInputElement>()
  contentRef = React.createRef<HTMLInputElement>()

  render() {
    return (
    <MutationMessage
      mutation={createMessageSchema}
    >
      {(createMessage) => {
        return (
          <>
            <div>
              <input
                ref={this.authorRef}
                type='text'
                placeholder='Author'
              />
              <input
                ref={this.contentRef}
                type='text'
                placeholder='Content'
              />
            </div>
            <button
              onClick={() => this._createMessage(createMessage)}
            >
              submit
            </button>
          </>
        )
      }}
      </MutationMessage>
    )
  }

  _createMessage = (createMessage: MutationFn<CreateMessageMutation, CreateMessageMutationVariables>) => {
    if (this.authorRef.current  && this.contentRef.current) {
      const { value: authorValue } = this.authorRef.current
      const { value: contentValue } = this.contentRef.current
      const value = {
        variables: {
          input: {
            content: contentValue,
            author: authorValue 
          }
        },
        optimisticResponse: {
          createMessage: {
            __typename: "MessagePayload" as "MessagePayload",
            messageEdge: {
              __typename: "MessageEdge" as "MessageEdge",
              node: {
                __typename: "Message" as "Message",
                id: 'xxx',
                content: contentValue,
                author: authorValue 
              }
            }
          }
        },
        update: updateFucntion
      }
      createMessage(value)
    }
  }
}
 
```

We extend `Mutation` component in `react-apollo` with type we just generated to create our own component:

```
class MutationMessage extends Mutation<CreateMessageMutation, CreateMessageMutationVariables> {}
```

`MutationMessage` need mutation schema and provide `createMessage` method.
`createMessage` is a `MutationFn` type method which available arguments with an object type `(options?: MutationOptions<TData, TVariables>)`.

`TData` set as `CreateMessageMutation `, `TVariables` set as `CreateMessageMutationVariables`
and `MutationOptions` available arguments as below:

```
export declare type MutationOptions<TData = any, TVariables = OperationVariables> = {
    variables?: TVariables;
    optimisticResponse?: TData;
    refetchQueries?: Array<string | PureQueryOptions> | RefetchQueriesProviderFn;
    awaitRefetchQueries?: boolean;
    update?: MutationUpdaterFn<TData>;
    context?: Record<string, any>;
    fetchPolicy?: FetchPolicy;
};
```

Here we use `update` function and `optimisticResponse` object for real/fake update, for each props usage please check [spec](https://www.apollographql.com/docs/react/essentials/mutations.html#props).

`optimisticResponse` ask a fake data which shape should same as data in cache, if the shape is not same will jump out error in run time.

`update` is a `MutationUpdaterFn` type function:

```
export declare type MutationUpdaterFn<T = {
    [key: string]: any;
}> = (proxy: DataProxy, mutationResult: FetchResult<T>) => void;
```

`proxy` is a `DataProxy` from `apollo-cache`, point to `cache` which setting up at beginning in `ApolloClient`, later we will use function in `proxy` to update UI.

`mutationResult` is callback data of `mutation`.

```
const updateFucntion = (cache: DataProxy, mutationResult: { data: CreateMessageMutation }) => {
  const { createMessage } = mutationResult.data
  try {
    const queryData = cache.readQuery({ query: messageQUERY }) as GetMessage
    if (!queryData || !queryData.getMessage || !queryData.getMessage.edges || !createMessage) return
    queryData.getMessage.edges.push(createMessage.messageEdge)
    cache.writeQuery({
      query: messageQUERY,
      data: { getMessage: queryData.getMessage },
    })
  } catch (e) {
    console.log('cache no update')
  }
}
```
In update function, grab the new data we want to update from `mutationResult` and also get the current data in side cache by `readQuery` with query schema,

Push mutation callback data into current cache data, and update cache data by `writeQuery`,
here the data shape should also be the same.

Once function been call, on UI will add one more line with mutation callback and `optimisticResponse` will be remove, you can setting break point on `updateFunction` by chrome to see the UI change.

After all, use `CreateMessage` component in `App.tsx`:

```
// ./mutation/mutation-apollo/src/App.tsx

...
import { CreateMessage } from './CreateMessage'
...

<Grid container spacing={24}>
  <Grid container item xs={6} spacing={16}>
    <Grid item xs={6}>
      <Paper className={classes.infoPaper}>
        <CreateMessage />
      </Paper>
    </Grid>
	...
  </Grid>
</Grid>
```

Once click the submit button, mutation will be tigger and cache/UI will been update.

#### Relay

Same ideal in `Relay`, mock fake data on UI and change to real callback, but relay ask more step.

Firstable query schema need to updated as below:

```
// ./mutation/mutation-relay/src/query/getMessages.js

import { graphql } from 'react-relay'

export const getMessagesQuery = graphql`
  query getMessagesQuery($first: Int) {
    getMessage(first: $first) @connection(key: "messages_getMessage") {
      edges {
        node {
          id
          author
          content
        }
      }
    }
  }
`
```

To updated `Relay` cache, not only data shape should be the same but also need to use `@connection` to get what edge we are going to update, later we will see the usage of `@connection`.

Also if we want to use `@connection` in schema, `Relay` expected the query should be able to pagination, which means `getMessage` need to provide arguments like `after`, `before`...etc, we are not going to use those arguments in this example but just put there for `relay-compiler` generate type successfully.

Schema for mutation schema is pretty same as `Apollo`:

```
// ./mutation/mutation-relay/src/mutation/CreateMessageMutation.js

import { commitMutation, graphql } from 'react-relay'
import { ConnectionHandler } from 'relay-runtime'
import { modernEnvironment as environment } from '../env'

export const createMessageSchema = graphql`
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

const sharedUpdater = (store, newEdge) => {
  const connectionProxy = store.getRoot()
  const conn = ConnectionHandler.getConnection(
    connectionProxy,
    'messages_getMessage',
  )
  ConnectionHandler.insertEdgeAfter(conn, newEdge)
}


export const createMessageMutation = (author, content, callback) => {
  const variables = {
    input: {
      author,
      content,
    },
  }

  return commitMutation(
    environment,
    {
      mutation: createMessageSchema,
      variables,
      onCompleted: (response, errors) => {
        if(errors) console.log('errors received from server: ', errors)
        console.log('Response received from server: ', response)
        callback()
      },
      onError: err => console.error(err),
      updater: (store) => {
        const payload = store.getRootField('createMessage')
        const newEdge = payload.getLinkedRecord('messageEdge')
        sharedUpdater(store, newEdge)
      },
      optimisticUpdater: (store) => {
        const id = 'node_cursor_xxxx'
        const node = store.create(id, 'Message')
        node.setValue(id, 'id')
        node.setValue(content, 'content')
        node.setValue(author, 'author')
        const newEdge = store.create(
          'edge_cursor_xxxx',
          'messageEdge',
        )
        newEdge.setLinkedRecord(node, 'node')
        sharedUpdater(store, newEdge)
      },
    }
  )
}
```

Here we create `createMessageMutation` for component, it calls `commitMutation` provide by `react-relay`.

`commitMutation` has two arguments `environment: Environment` and `config: MutationConfig<T>`, `environment` is the object we create in `./mutation/mutation-relay/src/env.js`, setting with Store(cache) and network.

`MutationConfig` is an object for mutaion config:

```
export interface MutationConfig<T extends OperationBase> {
    configs?: RelayMutationConfig[];
    mutation: GraphQLTaggedNode;
    variables: T["variables"];
    uploadables?: UploadableMap;
    onCompleted?(response: T["response"], errors: PayloadError[] | null | undefined): void;
    onError?(error?: Error): void;
    optimisticUpdater?: SelectorStoreUpdater<T["response"]>;
    optimisticResponse?: T["response"];
    updater?: SelectorStoreUpdater<T["response"]>;
}
```

In this example we including `mutation`, `variables`, `onCompleted`, `onError`, `optimisticUpdater` and `updater`, usage for other props please check [spec](https://facebook.github.io/relay/docs/en/mutations.html#arguments)

 - `mutation` is mutation schema, here is `createMessageSchema` we create above.
 - `variables` is variables use for mutation, object shape should be same as `$input`, here is `{ input: { author, content } }`.
 - `onCompleted` Callback function executed when the request is completed and the Relay store is updated with the updater function.
 - `onError` is callback function if mutation fail.
 - `optimisticUpdater` let you have fully control cache before `updater` function been call, has variable  `store: RecordSourceSelectorProxy` and `data: T`.
 - `updater` has same variable as `optimisticUpdater`, the only different is this function will be execute after mutation end and cache already include sever callback.
 	- In `optimisticUpdater`, we use `store` to create mock data and update UI.
 	- In `updater`, we use `store` to grab the real server callback and update UI.

`store: RecordSourceSelectorProxy` has method below:

```
export interface RecordSourceSelectorProxy {
    create(dataID: DataID, typeName: string): RecordProxy;
    delete(dataID: DataID): void;
    get(dataID: DataID): RecordProxy | null;
    getRoot(): RecordProxy;
    getRootField(fieldName: string): RecordProxy | null;
    getPluralRootField(fieldName: string): RecordProxy[] | null;
}
```
In `optimisticUpdater`, we use `store.create` function to create `Record`, and setting value(`author`, `content`...etc).
Create another `Record` as `Edge` type and made same shape as `Query` schema.

```
optimisticUpdater: (store) => {
  const id = 'node_cursor_xxxx'
  const node = store.create(id, 'Message')
  node.setValue(id, 'id')
  node.setValue(content, 'content')
  node.setValue(author, 'author')
  const newEdge = store.create(
    'edge_cursor_xxxx',
    'messageEdge',
  )
  newEdge.setLinkedRecord(node, 'node')
  sharedUpdater(store, newEdge)
},
```

In `updater`, we use `getRootField`, `getLinkedRecord` to get update payload edge in cache.

```
updater: (store) => {
  const payload = store.getRootField('createMessage')
  const newEdge = payload.getLinkedRecord('messageEdge')
  sharedUpdater(store, newEdge)
},
```

Both final step in `optimisticUpdater` and `updater` are insert the new edge in the connection, use `ConnectionHandler` to get current records, `messages_getMessage` is the connection identifier.

```
const sharedUpdater = (store, newEdge) => {
  const connectionProxy = store.getRoot()
  const conn = ConnectionHandler.getConnection(
    connectionProxy,
    'messages_getMessage',
  )
  ConnectionHandler.insertEdgeAfter(conn, newEdge)
}
```

`ConnectionHandler.insertEdgeAfter` will insert edge in the connection.

##### Generate type

After finish `CreateMessageMutation.js` (here we have `./mutation/mutation-relay/src/mutation/CreateMessageMutation.ts`), run `npm run type`, `relay-compiler ` will help us to generate type under `./mutation/mutation-relay/src/mutation/__generated__/`.

##### Mutation React Component

Import `createMessageMutation` in `CreateMessage` React component,
click on submit button will tigger mutation, cache/UI will be updated.

```
// ./mutation/mutation-relay/src/component/CreateMessage.js

import React, { Component } from 'react'
import { createMessageMutation } from '../mutation/CreateMessageMutation'

export class CreateMessage extends Component {
  authorRef = React.createRef()
  contentRef = React.createRef()

  render() {
    return (
      <div>
        <div>
          <input
            ref={this.authorRef}
            type='text'
            placeholder='Author'
          />
          <input
            ref={this.contentRef}
            type='text'
            placeholder='Content'
          />
        </div>
        <button
          onClick={() => this._createMessage()}
        >
          submit
        </button>
      </div>
    )
  }

  _createMessage = () => {
    const { value: authorValue } =  this.authorRef.current 
    const { value: contentValue } =  this.contentRef.current 
    if (authorValue && contentValue) {
      createMessageMutation(authorValue, contentValue, () => {
        console.log('Update complete')
      })
    }
  }
}
```
##### Main React Component

```
// ./mutation/mutation-relay/src/component/Root.js

...
import { CreateMessage } from './CreateMessage'
...

return (
  <Grid container spacing={24}>
    <Grid container item xs={6} spacing={16}>
      <Grid item xs={6}>
        <CreateMessage />
      </Grid>
		...
    </Grid>
  </Grid>
)

```

## Summary

After Relay, Apollo Client mutation example, there are several things same and different.

Same:

- Update Cache to update the UI
- Support optimistic response

Different:

- Relay require more rule in server side and schema, such as `@connection`, pagination design

## Reference

- [Apollo client Mutation](https://www.apollographql.com/docs/react/essentials/mutations.html)
- [Relay Mutation](https://facebook.github.io/relay/docs/en/mutations.html)
- [Relay Store](https://facebook.github.io/relay/docs/en/relay-store.html)