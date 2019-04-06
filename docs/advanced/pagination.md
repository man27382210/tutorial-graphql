# Pagination

For this tutorial, we will introduce `Pagination` in GraphQL and implementation in Apollo Client / Relay.
We already introduce cursored based before, in this chapter we will start from server side design and then clien side.

## Overview

- [Pagination](#pagination)
  - [Overview](#overview)
  - [Preparation](#preparation)
  - [Look to the code](#look-to-the-code)
    - [Target](#target)
    - [Pagination Schema](#pagination-schema)
    - [Update UI](#update-ui)
      - [Apollo Client](#apollo-client)
        - [Generate type](#generate-type)
        - [Mutation React Component](#mutation-react-component)
      - [Relay](#relay)
        - [Generate type](#generate-type-1)
        - [Mutation React Component](#mutation-react-component-1)
        - [Main React Component](#main-react-component)
  - [Summary](#summary)
  - [Reference](#reference)

## Preparation

Start GraphQL server

```
$ cd graphQL-server && yarn run start
```

Start Apollo mutation example client server

```
$ cd ./pagination/pagination-apollo && yarn run start
```

It will run on [localhost:6001](localhost:6001)

## Look to the code

### Target

Press load more button to get more data from server.

### Pagination Schema

```
// 

type Query {
	...
	getMessageByPage(first: Int, after: String, last: Int, before: String): MessageConnection
	...
}

type MessageConnection {
	pageInfo: PageInfo
	edges: [MessageEdge]
	totalCount: Int
}

type PageInfo {
	startCursor: String
	endCursor: String
	hasNextPage: Boolean!
	hasPreviousPage: Boolean!
}

type MessageEdge {
	node: Message
	cursor: String
}
```

As we introduce before, in `getMessageByPage`:

- `$first: Int` and `$last: Int` are variables for describe how many data we need, `$first` is from begin of data set and `$last` is from bottom. For example, `first: 2` means first two data in data set.
- `$after: String` and `$before: String` are variables for describe after/before which edge cursor.

In `MessageConnection`:

- `pageInfo` is type of `PageInfo`, it's a pretty common design, you can in github, twitter...etc graphQL api, it shows some information of one query, and it's most important information for us to desgin pagination. For example, if `hasNextPage` is `true` and `endCursor` return `id = '2'`, our next page query will become `getMessageByPage(first: const, after: '2')`, so we can get data after `id = '2'`.
- `edges` is the data we need, `first one/last one` edge's cursor should be assign to `startCursor/endCursor` in `PageInfo`.
- `totalCount` is data set total count.

Function `getMessageEdgesFromPageInfo`(`./graphQL-server/index.js#125`) is a simple implementation of pagination in server side, there are so many different example on github such as restructure/constructure request to match `RESTful api/MySQL/MongoDB`, in this example just get data from fake data set.


```
{
  getMessageByPage {
    pageInfo {
      hasNextPage
      hasPreviousPage
      endCursor
      startCursor
    }
    edges {
      node {
        author
        content
        id
      }
    }
  }
}
```
is callback result data structure.

Open [GraphQL dashboard](http://localhost:4000/graphql) and play with pagination a little bit,
input string below in left screen and press play button.

```
query {
  getMessageByPage(first: 2) {
    pageInfo {
      hasNextPage
      hasPreviousPage
      endCursor
      startCursor
    }
    edges {
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
    "getMessageByPage": {
      "pageInfo": {
        "hasNextPage": true,
        "hasPreviousPage": false,
        "endCursor": "6c1cf44156f621cc7544",
        "startCursor": "53e0d37d8e2d34bf7ca5"
      },
      "edges": [
        {
          "node": {
            "author": "Davis",
            "content": "init content1",
            "id": "53e0d37d8e2d34bf7ca5"
          }
        },
        {
          "node": {
            "author": "Davis",
            "content": "init content2",
            "id": "6c1cf44156f621cc7544"
          }
        }
      ]
    }
  }
}
```
Next query we can update `getMessageByPage` arguments as `getMessageByPage(first: 2, after: "6c1cf44156f621cc7544")`, will return edges after edge cursor after `6c1cf44156f621cc7544`.

```
{
  "data": {
    "getMessageByPage": {
      "pageInfo": {
        "hasNextPage": true,
        "hasPreviousPage": true,
        "endCursor": "38cae14f803ed108cdc6",
        "startCursor": "779242304fa69c4f66e4"
      },
      "edges": [
        {
          "node": {
            "author": "Davis",
            "content": "init content3",
            "id": "779242304fa69c4f66e4"
          }
        },
        {
          "node": {
            "author": "Davis",
            "content": "init content4",
            "id": "38cae14f803ed108cdc6"
          }
        }
      ]
    }
  }
}
```

You can also try to play with `$befor` & `$last` too.

### Update UI

Back to React word, both `Apollo client` and `Relay` provide query react component and has a fetch function, tigger the fetch with new parameters to get new data.

#### Apollo Client

Open `./pagination/pagination-apollo`.

##### Generate type

Before we do the React code, we need to prepare schema and update type again.

- Prepare `paginate.ts` (here we have `./pagination/pagination-apollo/src/component/paginate.ts`)
- `npm run type`, `apollo client:codegen` will help us to generate type under `./pagination/pagination-apollo/src/component/--schema/`

##### Pagination 

```
import gql from 'graphql-tag'

export const messageQUERY = gql`
  query GetMessage($first: Int, $after: String, $last: Int, $before: String) {
    getMessageByPage(first: $first, after: $after, last: $last, before: $before) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        cursor
        node {
          id
          content
          author
        }
      }
      totalCount
    }
  }
`
```

##### Pagination React Component

```
// ./pagination/pagination-apollo/src/component/App.tsx#Line: 30

...
export class QueryMessage extends Query<GetMessage, GetMessageVariables> {}
...
export const GraphQLMessage = () => {
  const variables = { first: 2 }
  return (
    <QueryMessage
      query={messageQUERY}
      variables={variables}
    >
      {({ loading, data, error, fetchMore }) => {
        if (loading) return renderLoading()
        if (error) return renderError()
        if (!data) return renderNoData()
        const { getMessageByPage } = data
        const endCursor = !getMessageByPage || !getMessageByPage.pageInfo || !getMessageByPage.pageInfo.endCursor
          ? ''
          : getMessageByPage.pageInfo.endCursor

        return !getMessageByPage || !getMessageByPage.edges || !getMessageByPage.pageInfo
          ? renderNoData()
          : (
            <div>
              <ul>
                { getMessageByPage.edges &&
                  getMessageByPage.edges.length > 0
                  ? getMessageByPage.edges.map((edge, index) => {
                    return !edge || !edge.node
                      ? renderNoData()
                      : (
                        <li key={`node-index-${index}`}>
                          <div>{edge.node.id}</div>
                          <div>{edge.node.author}</div>
                          <div>{edge.node.content}</div>
                        </li>
                      )
                  })
                  : renderNoData()
                }
              </ul>
              { !getMessageByPage || !getMessageByPage.pageInfo || !getMessageByPage.pageInfo.hasNextPage
                  ? null
                  : <button onClick={() => fetchMore(
                    {
                      query: messageQUERY,
                      variables: {
                        ...variables,
                        after: endCursor,
                      },
                      updateQuery: (prev, next) => {
                        const { fetchMoreResult } = next
                        if (!fetchMoreResult ||
                            !fetchMoreResult.getMessageByPage ||
                            !fetchMoreResult.getMessageByPage.edges ||
                            !fetchMoreResult.getMessageByPage.pageInfo) return prev
                        const prevEdges = !prev.getMessageByPage || !prev.getMessageByPage.edges
                          ? []
                          : prev.getMessageByPage.edges
                        
                        const newEdges = fetchMoreResult.getMessageByPage.edges
                        const pageInfo = fetchMoreResult.getMessageByPage.pageInfo;
                        return {
                          getMessageByPage: {
                              __typename: "MessageConnection",
                              edges: [...prevEdges, ...newEdges],
                              pageInfo
                            }
                          }
                      }
                    })}>Read More</button>
               }
            </div>
          )
      }}
    </QueryMessage>
  )
}
...
```

We extend `Query` component in `react-apollo` with type we just generated to create our own component:

```
export class QueryMessage extends Query<GetMessage, GetMessageVariables> {}
```

Like query in first chapter, but we use one more function from `Query` is call `fetchMore`.

```
fetchMore: (<K extends keyof TVariables>(fetchMoreOptions: FetchMoreQueryOptions<TVariables, K> & FetchMoreOptions<TData, TVariables>) => Promise<ApolloQueryResult<TData>>) & (<TData2, TVariables2, K extends keyof TVariables2>(fetchMoreOptions: {
        query: DocumentNode;
    } & FetchMoreQueryOptions<TVariables2, K> & FetchMoreOptions<TData2, TVariables2>) => Promise<ApolloQueryResult<TData2>>);
```

`fetchMore` is the function we are going to use in pagination, this function will tigger fetch again, it's type including `query`, `FetchMoreQueryOptions` and `FetchMoreOptions`:

```
fetchMoreOptions: {
    query: DocumentNode;
} & FetchMoreQueryOptions<TVariables2, K> & FetchMoreOptions<TData2, TVariables2>
```

```
export interface FetchMoreQueryOptions<TVariables, K extends keyof TVariables> {
    query?: DocumentNode;
    variables?: Pick<TVariables, K>;
}
```

```
export interface FetchMoreOptions<TData = any, TVariables = OperationVariables> {
    updateQuery: (previousQueryResult: TData, options: {
        fetchMoreResult?: TData;
        variables?: TVariables;
    }) => TData;
}
```

- `query` is Query schema.
- `FetchMoreQueryOptions` include one more argument `variables`, here we extend first query `{ first: 2 }` with `{ after: endCursor }`, every time we click `Read More` button, will use new `endCursor`.
- `FetchMoreOptions` is an object include `updateQuery` function, it has `previousQueryResult`, `options: { fetchMoreResult, variables }`, here we merge `previousQueryResult` and `fetchMoreResult` as new data:

```
updateQuery: (prev, next) => {
	const { fetchMoreResult } = next
	if (!fetchMoreResult ||
   	 	!fetchMoreResult.getMessageByPage ||
    	!fetchMoreResult.getMessageByPage.edges ||
	   !fetchMoreResult.getMessageByPage.pageInfo) return prev
	const prevEdges = !prev.getMessageByPage || !prev.getMessageByPage.edges
  		? []
		: prev.getMessageByPage.edges
    
	const newEdges = fetchMoreResult.getMessageByPage.edges
	const pageInfo = fetchMoreResult.getMessageByPage.pageInfo;
	return {
		getMessageByPage: {
      		__typename: "MessageConnection",
	      edges: [...prevEdges, ...newEdges],
   		   pageInfo
    	}
  	}
}
```

After execute `updateQuery`, `QueryMessage` component will re-render with new data.

#### Relay

Same ideal in `Relay`, but Relay use `createPaginationContainer` for 

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