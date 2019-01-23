# What is GraphQL ?

**[GraphQL](https://graphql.org/)** GraphQL is a query language for your API

GraphQL service is created by defining types and fields on those types, then providing functions for each field on each type.

Make an example, a GraphQL service that tells us who the logged in user is as well as that user's name:

```
type UserQuery {
  user: User
}

type User {
  id: ID
  name: String
}
```

On server side, really query method will like this:
```
function Query_user(request) {
  return request.auth.user;
}

function User_name(user) {
  return user.getName();
}
```

Once GraphQL service is running (sever side), it allow to send a GraphQL queries.
A received query is first checked to ensure it only refers to the types and fields defined, then runs the provided functions to produce a result.

Query example:
```
{
  user {
    name
  }
}
```

Result json: 
```
{
  "user": {
    "name": "Luke Skywalker"
  }
}
```

Official website learn: [https://graphql.org/learn/](https://graphql.org/learn/)

### Recommended online GraphQL tutorials
[The Fullstack Tutorial for GraphQL](https://www.howtographql.com)
