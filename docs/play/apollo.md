# Apollo Client

For this tutorial, we will use `Apollo Client` to get Star Wars info.

## Overview

1. [Introduction of Apollo](#Introduction)
2. [Preparation](#preparation)
3. [Look to the code](#start-development)
4. [Practice](#practice)
5. [Unit Test](#unit-test)

## Introduction

Apollo is a product build by Meteor Development Group, which have Server side (mostly is NodeJS and Golang), Client side (JS, React, Angular, Vue, Android, iOS) and PaaS support.

[Apollo Client](https://github.com/apollographql/apollo-client) using Typescript,
Apollo Client have related library, each library deal with different things such as network connection, cache...etc,
here we use 


- apollo-client -> Create an Apollo client main object.
- apollo-link-http -> Create ApolloLink object, which will dealing with http connection.
- apollo-cache-inmemory -> Create GraphQL request cache object.
- react-apollo -> React HOC, using context way, also can be use in recompose way.
- apollo -> Command line tool, use this to generate type.


Apollo Client support strong type check,
but we need the GraphQL schema from server for helping us generate strong type,
this project use `get-graphql-schema` (which is localhost:5000 for this example) to get the schema,
will talk more detail later.


## Preparation

Before started,
we need to get schema from Server to generate type.

#### Launch GraphQL server

```
$ cd ./graphQL-server && yarn run start
```

#### Get the sechma from server

Now we can get the sechma, `get-graphql-schema` support GraphQL type or JSON type, In this example we use graphql type.

```
$ yarn run get-schema-graphql
```
This command will generate a `schema.graphql` file under `src/`,
look deep into it you can see the type definition of each field.


#### Generated TypeScript type

After get the schema, we will use `apollo` command to generated TypeScript type base on our query.

Query file is under `src/component/queries.ts`, in the `queries.ts` file we use [graphql-tag](https://github.com/apollographql/graphql-tag) to define the query.

`graphql-tag` will made query become AST(Abstract Syntax Tree), it's easy for `apollo` command to pares our query and generate type.

Run command

```
$ yarn run type
```

Look deep into this command

```
apollo client:codegen --localSchemaFile=src/schema.graphql --target typescript --queries=src/**/*.ts --outputFlat=src/component/--schema
```

`apollo client:codegen` need `--localSchemaFile` which is we grab from starwars server and target to `typescript`, here you can choose `flow/typescript`.

`--queries` require our query file, `apollo` command will only parse query string with `graphql-tag`.

`--outputFlat` will set the path of output type.


#### Start Apollo

```
$ cd ./query/query-server && yarn run start
```

Webpack dev server will run on [http://localhost:3001](http://localhost:3001)

## Look to the code

### Target

Same as previous section.
Click on button for fetch message.

### Main component

#### src/index.tsx

In `src/index.tsx`, we import different `Apollo` related library:

- apollo-link-http

```
import { createHttpLink } from 'apollo-link-http'
const graphqlUrl = 'http://localhost:4000/grahpql'

const httpLink = createHttpLink({
  uri: graphqlUrl,
})
```
`apollo-link-http` create `httpLink` object. 

- apollo-cache-inmemory

```
import { InMemoryCache } from 'apollo-cache-inmemory'
const cache = new InMemoryCache();
```
`apollo-cache-inmemory` create `cache` object.

- apollo-client

```
import { ApolloClient } from 'apollo-client'
const client = new ApolloClient({
  cache,
  link: httpLink
})
```

`apollo-client` create `client` object which has parameters for assign cache and link object.

- react-apollo

```
import { ApolloProvider } from 'react-apollo'
export default () => (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
)
```

`react-apollo` provide `ApolloProvider`, give a client and wrapper our App.
This is react context way which we can got the response from child element.

#### src/App.tsx

```
import * as React from 'react'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import { withStyles, WithStyles, createStyles } from '@material-ui/core/styles'
import { getMessage as GetMessage, getMessage_getMessage_edges as GetMessageEdges } from './--schema/getMessage'
import { messageQUERY } from './queries'
import { Query } from 'react-apollo'

export class MessageQuery extends Query<GetMessage, {}> {}

export const searchStyle = () => createStyles({
  pre: {
    margin: 0,
  },
  infoPaper: {
    padding: 20,
    minHeight: 100,
  }
})

interface Props extends WithStyles<typeof searchStyle> {}

const renderNoData = () => <div>No data</div>
const renderLoading = () => <div>Loading</div>
const renderError = () => <h1>ERROR</h1>

export const Messages = () => {
  return (
    <MessageQuery query={messageQUERY} variables={{}}>
      {({ loading, data, error }) => {
        if (loading) return renderLoading()
        if (error) return renderError()
        if (!data) return renderNoData()
        const { getMessage: messages } = data
        if (!messages) return renderNoData()
        const { edges } = messages
        return edges ? (
          <div>
            <ul>
              {edges &&
                 edges.length > 0
                  ? edges.map((edge: GetMessageEdges, index: number)  => {
                    return edge && edge.node
                      ? (
                        <li key={`index-${index}`}>
                          <div>{edge.node.author}</div>
                          <div>{edge.node.id}</div>
                          <div>{edge.node.content}</div>
                        </li>
                      )
                      : renderNoData()
                  })
                  : null
                }
            </ul>
          </div>
        ) : renderNoData()
      }}
    </MessageQuery>
  )
}

export const App = withStyles(searchStyle)(
  class extends React.Component<Props, { loading: boolean }> {
    state = {
      loading: true
    }
    submitPerson = () => this.setState({loading: false})
    render() {
      const { classes } = this.props
      const { loading } = this.state
      return (
        <Grid container item xs={6} spacing={16}>
          <Grid item xs={6}>
            <Paper className={classes.infoPaper}>
              <button onClick={this.submitPerson}> GET Message </button>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper className={classes.infoPaper}>
              {!loading
                ? <Messages />
                : renderLoading()
              }
            </Paper>
          </Grid>
        </Grid>
      )
    }
  }
)

export default App
```

`getMessage` and `getMessage_getMessage_edges` are types from `'./--schema/getMessage'`:

```
export interface getMessage_getMessage_edges_node {
  __typename: "Message";
  id: string;
  author: string | null;
  content: string | null;
}

export interface getMessage_getMessage_edges {
  __typename: "MessageEdge";
  node: getMessage_getMessage_edges_node | null;
}

export interface getMessage_getMessage {
  __typename: "MessageConnection";
  edges: (getMessage_getMessage_edges | null)[] | null;
}

export interface getMessage {
  getMessage: getMessage_getMessage | null;
}
```

It define interface of response data format and query variables, which we use for create new class extends `Query` from `react-apollo`.

Check `Query` in `react-apollo`, it extends `React Component` and receive two generic type interface `<TData, TVariables>`, `TDate` we assgin `getMessage`(rename to `GetMessage` in `src/App.tsx`) and `TVariables` assign `{}` due to we don't need variables for now.

In stateless component `Messages`, we implement `MessageQuery` with two params:

- query set to `messageQUERY`, `messageQUERY` is query schema.
- variables set to `{}`.

This component will do GraphQL fetch when mount.

Same as context api, `loading`, `data` and `error` are context values we can use, each status update will re-render the component.

At last, we can get `getMessage` from data and render information.


### Click

```
export const App = withStyles(searchStyle)(
  class extends React.Component<Props, { loading: boolean }> {
    state = {
      loading: true
    }
    submitPerson = () => this.setState({loading: false})
    render() {
      const { classes } = this.props
      const { loading } = this.state
      return (
        <Grid container item xs={6} spacing={16}>
          <Grid item xs={6}>
            <Paper className={classes.infoPaper}>
              <button onClick={this.submitPerson}> GET Message </button>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper className={classes.infoPaper}>
              {!loading
                ? <Messages />
                : renderLoading()
              }
            </Paper>
          </Grid>
        </Grid>
      )
    }
  }
)
```

Once click the button, `loading` in state will change and render `Messages` component.

### GraphQL Schema

```
export const messageQUERY = gql`
  query getMessage {
    getMessage {
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

Almost same as previous practice,
add `getMessage` after `query` as operation name.

### Type Check

With Typescript and generated type,
it's easy to prevent type error.

```
<MessageQuery query={messageQUERY} variables={{}}>
  {({ loading, data, error }) => {
    if (loading) return renderLoading()
    if (error) return renderError()
    if (!data) return renderNoData()
    const { getMessage: messages } = data
    const { edges } = messages
    ...
```
TSLint will jump out error message where edges:

```
[ts]
	Property 'edges' does not exist on type 'getMessage_getMessage | null'.
```

Add condition to make sure `messages` in data is not `null`.

## Practice

Like previous practice,
please try to fetch more information by update the schema,
don't forget re-generate the type.

## Unit test

In the section, we need some step to setup and target what kind of unit test we need to wirte.

### Setup

Here we use `jest` and `enzyme`, it's very popular unit test tool in JS / React world.
This project is create from `create-react-app`, which has test script setup in `package.json`: 

```
"scripts": {
    ...
    "test": "node scripts/test.js --env=jsdom",
```

Command set `--env` as `jsdom` and in `scripts/test.js` run `jest` as global variable.

Seems this Application use Apollo Client Query to do GraphQL fetch,
there are some topic we can test:

- When component mount, Query component really do fetch and render the component.
- `spyOn` apollo client object and make sure the fetch method really tigger.
- The `query` which apollo client send is same as what we expect.
- Component render element from mock response.

Due to above reason, we need to do some setup to make unit test work.

- `test/setup.ts` is setting up `enzyme-adapter-react-16`.
- `test/client-mock.ts` is making a fake Apollo client by use `makeExecutableSchema`, define fake `sechma` and `resolvers` instead of request real GraphQL server.


### Testing

```
import * as React from 'react'
import { ApolloProvider } from 'react-apollo'
import { mount } from 'enzyme'

import '../../test/setup'

import clientMock from '../../test/client-mock'

import { Messages } from './App'
import { messageQUERY } from './queries'

describe('Messages', () => {
  it('calls the query method on Apollo Client', () => {
    const clientMockSpy = jest.spyOn(clientMock, 'watchQuery');

    mount(
      <ApolloProvider client={clientMock}>
        <Messages />
      </ApolloProvider>,
    )

    expect(clientMockSpy).toHaveBeenCalled()
    expect(clientMockSpy.mock.calls[0][0].query).toEqual(messageQUERY)
    clientMockSpy.mockRestore()
  })

  it('Render component', () => {
    const wrapper = mount(
      <ApolloProvider client={clientMock}>
        <Messages />
      </ApolloProvider>,
    )
    expect(wrapper.find('div').at(0).text()).toContain('Davis')
  })
})
```

Import `'../../test/setup'` for setting `Jest` as global variable, `Jest` provide `BDD`/`TDD` method so we don't need to include other library.

`clientMock` is the mock client for `ApolloProvider`, which `Query` will go through this mock client.

First test is to check component really call the query method and the query is what we expected when component mount.
`spyOn` will monitoring the `clientMock` method, all query will go with `watchQuery` method in `clientMock`(Jump into `ApolloClient.d.ts`, there are all method type definition. `watchQuery` not just use in one query but also query and mutation, for more detail please check here [watchQuery vs query](https://github.com/Akryum/vue-apollo/issues/1)).

`expect` the spy object has been call once.
Also this object provide a mock instance for access to the mock's metadata, grab the query we send and compare the is it same as the query `messageQUERY` we setting in component.

Second is make sure component real render element, the element value should same as our mock data.

## Reference
- [Apollo Client](https://github.com/apollographql/apollo-client)
- [Apollo client testing](https://www.apollographql.com/docs/react/recipes/testing.html)
- [react-apollo-client-testing](https://www.robinwieruch.de/react-apollo-client-testing/)
- [testing-apollos-query-component](https://blog.apollographql.com/testing-apollos-query-component-d575dc642e04)


