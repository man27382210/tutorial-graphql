# Basic Usage

For this example, we will use `fetch` to get Star Wars info.

## Overview

1. [Preparation](#preparation)
2. [Look to the code](#look-to-the-code)
3. [Overall](#overall)

## Preparation

Start GraphQL server

```
$ cd swapi-graphql && yarn run start
```

Start GraphQL basic web server

```
$ cd starwars-normal && yarn run start
```

It will run on [localhost:3000](localhost:3000)

## Look to the code

### Target
Make a input field for input personID as query variable,
fetch person info and show on component.

### Main component

Whole application is base on React 16.6 new context api,
it's high order component which has own state and you can imagine it as a Singleton pattern.
Below is simple sudo code:

```
const PersonState: Person = {
  person: {},
  error: false,
  loading: true,
  personID: '1',
  graphqlQueryString: personQuery,
}

const PersonContext = React.createContext(PersonState)

class App extends React.Component<Props, Person> {
  fetchPerson = () => {
    //do fetch
    fetch(graphql endpoint...)
    .then(data => {
      this.setState({person: data.person, loading: false})
    })
    .catch((e) => this.setState({error: true}))
  }

  render() {
    return (
      <PersonContext.Provider
        value={
          {
            fetchPerson: this.fetchPerson,
            ...this.state
          }
        }>
          <Component>
      </PersonContext.Provider>
    )
  }
}

const Component = () => {
  return (
    <PersonContext.Consumer>
    {({ loading, error, person }) => {
      if(loading) return (<>loading</>)
      if(error) return (<>error</>)
      return (<>{person}</>)
    }}
    </PersonContext.Consumer>
  )
}
```

With this setting,
Component is in Context API lifecycle,
once any async function trigger and change state,
Component will re-render with new state.

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
GrahpQL server will return thins message with 400 status,
so will go to error case.

```
.catch((e: Error) => {
  this.setState({loading: false, error: true})
})
```

## Pratice

Please try to fetch more information by update the schema,
also you can try to get other root field such film...etc.

## Overall

During this overview, we see the simple usage of GraphQL,
it's easy to understand and flexible, easiest fetch setting and change schema to get all data you need.

But still, we have some problem need to deal with:

- No cache: Means each refresh time will re-send the request.
- Type / Schema check: There is no type / schema checking during compile time, which means we will have no ideal if schema has wrong field before we made a real request.
- State less: In this example we use context api to control App state, is there anything more convenient then make our component more state less? 

Due to those reason, GraphQL community jump out two library --> [Apollo]() / [Relay]().

Next step will introduce Apollo Client and this community's echosystem.
