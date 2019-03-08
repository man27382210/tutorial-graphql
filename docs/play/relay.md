# Relay

For this tutorial, we will use `Relay (modern)` to get Star Wars info.

## Overview

1. [Introduction of Relay](#Introduction)
2. [Preparation](#preparation)
3. [Look to the code](#start-development)
4. [Practice](#practice)
5. [Unit Test](#unit-test)

## Introduction

Relay is a framework build by Facebook.
In the introduction, Relay is data-driven React component, not like Apollo support different platform, Relay focus on React and it's head of GraphQL development, most of new feature on Relay will close to Facebook usage.

Relay also allow component specify what kind of data it need only provide the data, which we can see more example in this tutorial.

## Preparation

Before started, Relay need strong type support during build time, not like Apollo is a option, Relay is more strictly and so far only support `Flow`.

Same as previous tutorial, we need to download schema from server.

#### Launch GraphQL server

```
$ cd graphQL-server && yarn run start
```

#### Get the schema from server

Now we can get the sechma, `get-graphql-schema` support GraphQL type or JSON type, In this example we use graphql type.

```
$ cd ./query/query-relay && yarn run get-schema-graphql
```
This command will generate a `schema.graphql` file under `src/`,
look deep into it you can see the type definition of each field.


#### Generated Flow type

After get the schema, we will use `relay-compiler` command to generated Flow type base on our query.

Query file is under `src/component/queries/*.js`.

Remember we introduce `Fragment` in [2.3 - Terminologies](../../graphql/terminologies.md), here we defined query schema by using fragment, so `relay-compiler` will generate each fragment type, we will explain why using fragment in this example.

Run command

```
$ cd ./query/query-relay && yarn run type
```

Look deep into this command

```
relay-compiler --src ./src/component/ --schema ./schema.graphql
```

`compiler` will grab queries in `--src` and generate type.

`--schema` is the schema we got from server side.

`relay-compiler` will put the generated type files under `__generated__`, each file not only describe the type but also show the AST.

#### Start Relay

```
$ cd ./query/query-relay && yarn run start
```

Webpack dev server will run on [http://localhost:3002](http://localhost:3002)

## Look to the code

### Target

Same as previous section.
Click on button for fetch message.

### Main component

#### src/component/Root.js

```
export const MessageQuery = searchStyle((props) => {
  const { classes } = props
  return (
    <QueryRenderer
      environment={modernEnvironment}
      query={getMessagesQuery}
      variables={{}}
      render={({error, props}) => {
        if (error) {
          return <Paper className={classes.infoPaper}><div>Error</div></Paper>
        }
        if (props && props.getMessage) {
          return <MessageFragment data={props.getMessage}/>
        } else {
          return <Paper className={classes.infoPaper}><div>Loading</div></Paper>
        }
      }}
    />
  )
})
```

In `src/component/Root.js`, we import `QueryRenderer` from `react-relay`,
`QueryRenderer` will fetch the data when component mount time.

`QueryRenderer` need setting parameters `environment`, `variables` and `query` schema.

`environment` is set in `src/env.js`.

#### src/env.js

```
import { Environment, Network, RecordSource, Store } from 'relay-runtime'
import 'whatwg-fetch'

function fetchQuery(operation, variables) {
  return fetch('http://localhost:4000/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: operation.text,
      variables,
    }),
  }).then(response => {
    return response.json()
  })
}

export const modernEnvironment = new Environment({
  network: Network.create(fetchQuery),
  store: new Store(new RecordSource()),
})
```

There are serveral way to implementation network layer in `Relay`,
here we use facebook isomorphic fetch `whatwg-fetch` and create a `Store` object as cache.

`operation.text`, `variables` are query schema and variables we set in `QueryRender`.
Once component mount, will get the data in props.

Pass data to child component `MessageFragment`.

#### src/component/MessageFragment.js

```
import React from 'react'
import Paper from '@material-ui/core/Paper'
import { createFragmentContainer } from 'react-relay'
import NodeFragment from './NodeFragment'
import { messages as messagesQuery } from '../queries/messages'
import { searchStyle } from '../util/style'

const Messages = searchStyle((props) => {
  const { classes, data: getMessage } = props
  const { edges } = getMessage
  if(!edges || edges.length === 0) return <>Error</>
  return (
    <Paper className={classes.infoPaper}>
      <ul>
        {edges &&
         edges.length > 0
          ? edges.map((edge, index)  => {
            return edge
              ? (
                <li key={`index-${index}`}>
                  <NodeFragment data={edge} />
                </li>
              )
              : null
          })
          : null
        }
      </ul>
    </Paper>
  )
})

export default createFragmentContainer(
  Messages,
  messagesQuery,
)
```

Start from here is the most different part between Apollo,
at beginning we import `createFragmentContainer` from `react-relay`.

Constructor of `createFragmentContainer` needs a `component` for using GraphQL fragment data and `fragmentSpec` is specifies the data requirements for the Component via a GraphQL fragment, the required data will be available on the component as props that match the shape of the provided fragment.

`createFragmentContainer` not directly fetch the data, but will make sure data exist or not before render.

For more detail, please check reference [here](https://facebook.github.io/relay/docs/en/fragment-container.html).

`Messages ` is the stateless component above,
`messagesQuery` is the fragment spec.

#### src/queries/getMessages.js

```
import { graphql } from 'react-relay'

export const getMessagesQuery =  graphql`
  query getMessagesQuery {
    getMessage {
      ...messagesFragment
    }
  }
`
```

Not like previous chapter, here we separate query schema into root and fragment,
by this design we can use several high order component `xxxContainer` with fragment to do things,
this part will introduce in future chapter.

#### src/queries/messages.js

```
import { graphql } from 'react-relay'

export const messages =  graphql`
  fragment messagesFragment on MessageConnection {
    edges {
      ...nodeFragment
    }
  }
`
```

if we print out the data in component `MessageFragment` and compare to data in network console, we can see what's different between Relay and Apollo.

In network console, all data has been fetch as image:

<img src="../../gitbook/images/relay_network.png" width="500" />

Comapre to data we priint out in `MessageFragment` component, you can only get data specifies in fragment spec, Relay will mask other data out of this fragment spec like data in `NodeFragment`.

<img src="../../gitbook/images/relay_message.png" width="500" />

### Click

Same as previous tutorial, click button and change loading state, mount the component.

### Summary

Relay core thinking is *declarative component*, which means each component describe what kind of data it needs and show on UI.

Relay decrease component coupling via only can access the data specify in spec, even child component.

For more detail, please check [document](https://facebook.github.io/relay/docs/en/thinking-in-relay.html).

## Practice

Like previous practice,
please try to fetch more information by update schema and create more fragment,
don't forget re-generate the type.

## Unit test

In the section, we need some step to setup and target what kind of unit test we need to wirte.

### Setup

Same as pervious tutorial, we use `jest` and `enzyme` as unit test tool, also Relay use global fetch in Network layer, we use `jest-fetch-mock` for stub fetch method to return fake data.

#### test/setup.js

```
global.fetch = require('jest-fetch-mock')
```
#### test/mockFetch.js

```
export function mockFetch({ status = 200, response }) {
  global.fetch = jest.fn(async () => ({
    status,
    ok: status < 400,
    json: async () => response
  }))
}
```

Seems this Application use react-relay `QueryRenderer` to do GraphQL fetch,
we want to test component render element from mock response.


### Testing

#### Test QueryRenderer component

```
// src/component/Root.test.js
import React from 'react'
import '../../test/setup'
import { mount } from 'enzyme'
import { modernEnvironment } from '../env'
import { MessageQuery } from './Root'
import { mockFetch } from '../../test/mockFetch'

describe('MessageQuery', () => {
  const mockData = {
    getMessage: {
      edges: [
        {
          node: {
            id: "f303b555c9d1f9f97160",
            author: "Davis",
            content: "init content1"
          }
        }
      ]
    }
  }

  describe('Root app', () => {
    it('should render content when given a successful response', async () => {
      mockFetch({response: { data: mockData }})
      const wrapper = mount(<MessageQuery />)
      return Promise.resolve(wrapper)
        .then((comp) => {
          return comp.update()
        })
        .then(() => {
          expect(wrapper.text()).toContain("Davis")
        })
    })

    it('should render error when given a fail response', async () => {
      mockFetch({status: 500})
      modernEnvironment.getStore().getSource().clear()
      const wrapper = mount(<MessageQuery />)
      return Promise.resolve(wrapper)
        .then((comp) => {
          return comp.update()
        })
        .then(() => {
          expect(wrapper.text()).toContain("Error")
        })
    })
  })
})
```

`mockFetch` will helping us mock the response and check the element/text exist or not,
the different is `QueryRenderer` make a `async` request, we need to wait the component get the mock data and then run the test.
Here using a `Promise.resolve` and `update()` to get the final render status of component.

Seems we setting cache in react-relay, we need to clear the cache to do the next test, otherwise even we mock a bad request, the `QueryRenderer` will use cache in the component because query schema is the same one.

`modernEnvironment.getStore().getSource().clear()` will clear the cache.

#### Fragment component test

```
// src/component/MessageFragment.test.js
jest.mock('react-relay', () => ({createFragmentContainer: component => component}))
import React from 'react'
import '../../test/setup'
import { mount } from 'enzyme'
import MessageFragment from './MessageFragment'

describe('Info', () => {
  const mockData = {
    getMessage: {
      edges: [
        {
          node: {
            id: "f303b555c9d1f9f97160",
            author: "Davis",
            content: "init content1"
          }
        }
      ]
    }
  }

  describe('Info Fragment', () => {
    it('should render content when have data pass', async () => {
      const wrapper = mount(<MessageFragment classes={{}} data={mockData.getMessage} />)
      expect(wrapper.text()).toContain("Davis")
    })
    it('should render Error when given empty data', async () => {
      const wrapper = mount(<MessageFragment classes={{}} data={{}} />)
      expect(wrapper.text()).toContain("Error")
    })
  })
})
```

In this testing, most important thing is mock the `react-relay` and it's `createFragmentContainer` function, it will make Info component become a pure function component and no need to check the schema.


## Reference
- [Relay official Document](http://facebook.github.io/relay/docs/en/introduction-to-relay.html)
- [relay-modern-flow-jest-example](https://github.com/zth/relay-modern-flow-jest-example)


