# Basic Usage

For this tutorial, we will use `fetch` to get Message info.

## Overview

1. [Preparation](#preparation)
2. [Look to the code](#look-to-the-code)
3. [Practice](#practice)
4. [Overall](#overall)

## Preparation

Start GraphQL server

```
$ cd graphQL-server && yarn run start
```

Start GraphQL server

```
$ cd ./query/query-normal && yarn run start
```

It will run on [localhost:3001](localhost:3001)

## Look to the code

### Target

Click on button for fetch message.

### Main component

Whole application is base on React 16.6 new context api,
it's high order component which has own state and you can imagine it as a Singleton pattern.
Below is simple sudo code:

```
type GetMessageType = {
  getMessage?: {
    edges?: [
      {
        node: {
          id: string
          author: string
          content: string
        }
      }
    ]
  }
}

type Message = {
  data: GetMessageType
  error: boolean
  loading: boolean
  fetchMessages?: () => void,
}

const MessageState: Message = { 
  data: {},
  error: false,
  loading: true,
}

const MessageContext = React.createContext(MessageState)

class App extends React.Component<{}, Message> {
  state = MessageState
  fetchMessages = () => {
    //do fetch
    fetch(graphql endpoint...)
    .then((result: ResultData) => {
      try {
        const resultObject = {
          data: result.data
            ? result.data
            : {},
          loading: false,
          error: false,
        }
        this.setState(resultObject)
      } catch {
        throw Error
      }
    })
    .catch((e) => this.setState({error: true}))
  }

  render() {
    return (
      <MessageContext.Provider
        value={
          {
            fetchMessages: this.fetchMessages,
            ...this.state
          }
        }
      >
          <Component>
      </MessageContext.Provider>
    )
  }
}

const Component = () => {
  return (
    <MessageContext.Consumer>
    {({ loading, error, data }) => {
      if(loading) return (<>loading</>)
      if(error) return (<>error</>)
      return (<Child data={data}/>)
    }}
    </MessageContext.Consumer>
  )
}
```

With this setting,
Component is in Context API lifecycle,
once any async function trigger and change state,
Component will re-render with new state.

### Input Field Component

We use the other component which have input field, submit button and also register `MessageContext`.

```
export const GetMessage = withStyles(searchStyle)(({ classes }: Props)=> {
  return (
    <MessageContext.Consumer>
      {({ fetchMessages }) => {
        const submitPerson = () => {
          if (fetchMessages) fetchMessages()
        }
        return (
          <Paper className={classes.infoPaper}>
            <button onClick={submitPerson}> GET Messages </button>
          </Paper>
        )
      }}
    </MessageContext.Consumer>
  )
})
```

Once click the button,
`fetchMessages` will trigger and do the fetch,
result will update context state and re-render Component to show the data or error.

### GraphQL Schema

Let's focus on GraphQL query,
see the queries file:

```
export const query = `
  query {
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

Query schema is same as last chapter.

### Fetch function

Let's really look deep into Fetch function

```
type ResultData = Partial<Message>

private fetchMessages = () => {
  if(fetch) {
  	fetch('http://localhost:4000/graphql', 
  	{
   	 method: 'POST',
   	 headers: {
   	   'Content-Type': 'application/json',
   	   'Accept': 'application/json',
   	 },
   	 body: JSON.stringify({
   	   query,
   	   variables: {},
   	 })
  	})
  	.then((res: Response) => res.json())
	.then((result: ResultData) => {
   	 try {
      const resultObject = {
        data: result.data
        ? result.data
        : {},
        loading: false,
        error: false,
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
```

GraphQL is run with `POST` method, `query ` is the query schema, we put in
query object with `query` key.

In this example, `variables` is empty object,
both `query` and `variables` will using `JSON.stringify` to build `JSON` string and put in body field,

### Response

```
{
  "data": {
    "getMessage": {
      "edges": [
        {
          "node": {
            "id": "1532c0dc095890cf8dfb",
            "author": "Davis",
            "content": "init content1"
          }
        },
        {
          "node": {
            "id": "9697eaf5c6c4fd87f861",
            "author": "Davis",
            "content": "init content2"
          }
        },
        {
          "node": {
            "id": "0fce6185f06d6e039351",
            "author": "Davis",
            "content": "init content3"
          }
        },
        ...
      ]
    }
  }
}
```

Response will inside `data` object, `getMessage` is the data we are looking for.
With this result we can show the information of this person.

### Error

When schema level error occurred (not network level),
response will include error object and show the message as example:

```
export const query = `
  query {
    getMessage {
      edges {
        node {
          id
          authorddddd <--- No such field in schema
          content
        }
      }
    }
  }
```

Response

```
{
  "errors": [
    {
      "message": "Cannot query field \"authorddddd\" on type \"Message\". Did you mean \"author\"?",
      "locations": [
        {
          "line": 6,
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

## Practice

Please try to fetch more information by update the schema,
also you can try to get other information.

## Overall

During this overview, we see the simple usage of GraphQL,
it's easy to understand and flexible, easiest fetch setting and change schema to get all data you need.

But still, we have some problem need to deal with:

- No cache: Means each refresh time will re-send the request.
- Type / Schema check: There is no type / schema checking during develop/compile time, which means we will have no ideal if schema has wrong field before we made a real request.

Due to those reason, GraphQL community jump out two library --> [Apollo](https://www.apollographql.com/) / [Relay](https://facebook.github.io/relay/).

Next step will introduce Apollo Client and this community's ecosystem.
