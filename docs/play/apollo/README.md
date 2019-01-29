# Apollo Client

For this example, we will use `Apollo Client` to get Star Wars info.

## Overview

1. [Introduction of Apollo](#Introduction)
2. [Preparation](#preparation)
3. [Look to the code](#start-development)

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

It will run on [http://localhost:3001](http://localhost:3001)

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

`apollo-client` create `client` object which has params cache and link.

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
import { SWPersonQUERY as QUERY } from './queries'
import { Query } from 'react-apollo'

class SWPerson extends Query<GetSWPersonByPersonID, GetSWPersonByPersonIDVariables> {}

const GraphQLPerson = (props: GraphQLPersonProps) => {
  const { personID } = props
  return (
    <SWPerson query={QUERY} variables={{personID}}>
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

It define interface of response data format and query variables,
which we need to assign to 


### Input Field Component

We use the other component which have input field, submit button and also register `PersonContext`.

```
export const SearchUser = () => {
  const personIDInput = React.createRef()
  return (
    <PersonContext.Consumer>
      {({fetchPerson}) => { 
        const submitPerson = () => {
          const personID = personIDInput.current ? personIDInput.current.value : '1'
          fetchPerson(personID)
        }
        return (
          <>
            <input ref={personIDInput} defaultValue='1' />
            <button onClick={submitPerson}> GET Person </button>
          </>
        )
      }}
    </PersonContext.Consumer>
  )
})
```

Once click the button,
`fetchPerson` will trigger and do the fetch,
result will update context state and re-render Component to show the data or error.

### GraphQL Schema

Let's focus on GraphQL query,
see the queries file:

```
query GetSWPersonByPersonID($personID: ID) {
  person(personID: $personID) {
    .....
  }
}
```

`GetSWPersonByPersonID` is operation name,
`$personID` is query variable use in person.

Here we made several `fragment` as example,
see which `films` this person appear and what kinds of `Starship` this person has.

### Fetch function

Let's really look deep into Fetch function

```
import { query as personQuery } from './queries'

fetchPerson = (personID) => {
    if(fetch) {
      fetch('http://localhost:5000/', 
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query: personQuery,
          variables: {
            "personID": `${personID}`,
          },
        })
      })
      .then((res: Response) => res.json())
      .then((result: {[key: string]: string}) => {
        try {
          const resultObject = {
            person: result.data['person'],
            loading: false,
            error: false,
            personID: personID
          }
          this.setState(resultObject)
        } catch {
          throw Error
        }
      })
      .catch((e: Error) => {
        this.setState({loading: false, error: true})
      })
    } else {
      this.setState({loading: false, error: true})
    }
  }
}
```

GraphQL is run with `POST` method, `personQuery` is the query schema, we put in
query object with `query` key.

`personID` is put in `variables` key as an object value,
both `query` and `variables` will using `JSON.stringify` to build `JSON` string and put in body field,

### Response

```
{  
   "data":{  
      "person":{  
         "id":"cGVvcGxlOjE=",
         "name":"Luke Skywalker",
         "filmConnection":{  
            "films":[  
               {  
                  "title":"A New Hope",
                  "episodeID":4
               },
               {  
                  "title":"The Empire Strikes Back",
                  "episodeID":5
               },
               {  
                  "title":"Return of the Jedi",
                  "episodeID":6
               },
               {  
                  "title":"Revenge of the Sith",
                  "episodeID":3
               },
               {  
                  "title":"The Force Awakens",
                  "episodeID":7
               }
            ]
         },
         "starshipConnection":{  
            "starships":[  
               {  
                  "name":"X-wing",
                  "starshipClass":"Starfighter"
               },
               {  
                  "name":"Imperial shuttle",
                  "starshipClass":"Armed government transport"
               }
            ],
            "totalCount":2
         }
      }
   }
}
```

Response will inside `data` object, `person` is the data we are looking for.
With this result we can show the information of this person.

### Error

When schema level error occurred (not network level),
response will include error object and show the message as example:

```
...
fragment info on Person {
    id
    name
    filmConnection {
      films {
        title
        episodeIDdddd // <-- here is the error
      }
    }
...
```

Response

```
{
  "errors": [
    {
      "message": "Cannot query field \"episodeIDdddd\" on type \"Film\". Did you mean \"episodeID\"?",
      "locations": [
        {
          "line": 12,
          "column": 9
        }
      ]
    }
  ]
}
```

GrahpQL server will return this message with 400 status,
so will go to error case.

```
.catch((e: Error) => {
  this.setState({loading: false, error: true})
})
```
