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
$ cd swapi-graphql && yarn run start
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
$ yarn run apollo-types
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
$ cd starwars-apollo && yarn run start
```

Webpack dev server will run on [http://localhost:3001](http://localhost:3001)

## Look to the code

### Target

Make a input field for input personID as query variable,
fetch person info and show on component.

Same as previous section.

### Main component

#### src/index.tsx

In `src/index.tsx`, we import different `Apollo` related library:

- apollo-link-http

```
import { createHttpLink } from 'apollo-link-http'
const graphqlUrl = 'http://localhost:5000/grahpql'

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
import { GetSWPersonByPersonID, GetSWPersonByPersonIDVariables } from './--schema/GetSWPersonByPersonID'
import { shipInfo } from './--schema/shipInfo'
import { SWPersonQUERY } from './queries'
import { Query } from 'react-apollo'

class SWPerson extends Query<GetSWPersonByPersonID, GetSWPersonByPersonIDVariables> {}

const GraphQLPerson = (props: GraphQLPersonProps) => {
  const { personID } = props
  return (
    <SWPerson query={SWPersonQUERY} variables={{personID}}>
      {({ loading, data, error }) => {
        if (loading) return renderLoading()
        if (error) return renderError()
        if (!data) return renderNoData()
        const { person } = data
        return person ? (
          <div >
            <div>{person.name}</div>
            <div>Start ship:</div>
            <ul>
              {person.starshipConnection &&
              person.starshipConnection.starships &&
              person.starshipConnection.starships.length > 0
                ? person.starshipConnection.starships
                    .map((ship: shipInfo, shipIndex: number)  => 
                    (
                      <li key={`shipIndex-${shipIndex}`}>
                        <div>{ship.name}</div>
                      </li>
                    ))
                : renderNoData()
              }
            </ul>
          </div>
        ) : renderNoData()
      }}
    </SWPerson>
  )
}
```

`GetSWPersonByPersonID` and `GetSWPersonByPersonIDVariables` are types from `'./--schema/GetSWPersonByPersonID'`:

```
export interface GetSWPersonByPersonID {
  person: GetSWPersonByPersonID_person | null;
}

export interface GetSWPersonByPersonIDVariables {
  personID?: string | null;
}
```

It define interface of response data format and query variables, which we use for create new class extends `Query` from `react-apollo`.

Check `Query` in `react-apollo`, it extends `React Component` and receive two generic type interface `<TData, TVariables>`, `TDate` we assgin `GetSWPersonByPersonID` and `TVariables` assign to `GetSWPersonByPersonIDVariables`.

In stateless component `GraphQLPerson`, we implement `SWPerson` with two params:

- query set to `SWPersonQUERY`, `SWPersonQUERY` is query schema.
- variables set to `{personID: personID}`, `personID` is a number from props, and with ES6 object shorthand just write `{personID}`.

This component will do GraphQL fetch when mount.
Due to `personID` is from props, component will re-fetch & re-render when `personID` value change.

Same as context api, `loading`, `data` and `error` are context values we can use, each status update will re-render the component.

At last, we can get `person` from data and render information.


### Input Field Component

We use the other component which have input field, submit button and also register `PersonContext`.

```
class extends React.Component<Props, State> {
    state = {
      personID: '',
      loading: true,
    }
    personIDInput = React.createRef<HTMLInputElement>()

    submitPerson = () => {
      if (this.personIDInput.current) {
        this.setState({personID: this.personIDInput.current.value, loading: false})
      }
    }

    render() {
      const { classes } = this.props
      const { loading, personID } = this.state
      return (
        <Grid container spacing={24}>
          <Grid container item xs={12}>
            <Paper>
              apollo POST
            </Paper>
          </Grid>
          <Grid container item xs={6} spacing={16}>
            <Grid item xs={6}>
              <Paper className={classes.infoPaper}>
                <input ref={this.personIDInput} defaultValue='1'/>
                <button onClick={this.submitPerson}> GET Person </button>
              </Paper>
            </Grid>
            <Grid item xs={6}>
              <Paper className={classes.infoPaper}>
                {!loading && personID.length > 0
                   ? <GraphQLPerson {...{classes, personID}}/>
                   : renderLoading()
                }
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      )
    }
  }
```

This component include `GraphQLPerson` component and it's own state.

```
submitPerson = () => {
  if (this.personIDInput.current) {
    this.setState({personID: this.personIDInput.current.value, loading: false})
  }
}
```

Once click the button,
`personID` and `loading` in state will change and render `GraphQLPerson` component with new `personID` value.

### GraphQL Schema

In `scr/SWPerson`:

```
export const SWPersonQUERY = gql`
  query GetSWPersonByPersonID($personID: ID){
    person(personID: $personID) {
      ...
    }
  }
  ...
  `
```

Almost same as previous practice,
`SWPerson` component will helping us match `query` and `variables` and handle all fetch status in context.

### Type Check

With Typescript and interface of variables,
let's make an example if variables is not the type we need.

```
const { personID } = props
  const id: number = parseInt(personID, 10)
  return (
    <SWPerson query={SWPersonQUERY} variables={{personID: id}}>
    ...
```

Create a `nubmer` const and assgin to `personID`,
TSLint will jump out type error:

```
[ts]
Type '{ personID: number; }' is not assignable to type 'GetSWPersonByPersonIDVariables'.
  Types of property 'personID' are incompatible.
    Type 'number' is not assignable to type 'string | null | undefined'. [2322]
```

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

import { GraphQLPerson } from './App'
import { SWPersonQUERY } from './queries'

describe('GraphQLPerson', () => {
  it('calls the query method on Apollo Client', () => {
    const clientMockSpy = jest.spyOn(clientMock, 'watchQuery');

    mount(
      <ApolloProvider client={clientMock}>
        <GraphQLPerson personID={'1'} />
      </ApolloProvider>,
    )

    expect(clientMockSpy).toHaveBeenCalled()
    expect(clientMockSpy.mock.calls[0][0].query).toEqual(SWPersonQUERY)
    clientMockSpy.mockRestore()
  })

  it('Render component', () => {
    const wrapper = mount(
      <ApolloProvider client={clientMock}>
        <GraphQLPerson personID={'1'} />
      </ApolloProvider>,
    )
    expect(wrapper.find('div').at(1).text()).toEqual('Luke Skywalker')
  })
})
```

Import `'../../test/setup'` for setting `Jest` as global variable, `Jest` provide `BDD`/`TDD` method so we don't need to include other library.

`clientMock` is the mock client for `ApolloProvider`, which `Query` will go through this mock client.

First test is to check component really call the query method and the query is what we expected when component mount.
`spyOn` will monitoring the `clientMock` method, all query will go with `watchQuery` method in `clientMock`(Jump into `ApolloClient.d.ts`, there are all method type definition. `watchQuery` not just use in one query but also query and mutation, for more detail please check here [watchQuery vs query](https://github.com/Akryum/vue-apollo/issues/1)).

`expect` the spy object has been call once.
Also this object provide a mock instance for access to the mock's metadata, grab the query we send and compare the is it same as the query `SWPersonQUERY` we setting in component.

Second is make sure component really render element, the element value should same as our mock data.

## Reference
- [Apollo Client](https://github.com/apollographql/apollo-client)
- [Apollo client testing](https://www.apollographql.com/docs/react/recipes/testing.html)
- [react-apollo-client-testing](https://www.robinwieruch.de/react-apollo-client-testing/)
- [testing-apollos-query-component](https://blog.apollographql.com/testing-apollos-query-component-d575dc642e04)


