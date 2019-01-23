# Terminologies

Main terminologies you need to learn and understand in how GraphQL work:

## Query

### Fields

Query

```
{
  hero {
    name
    friends {
      name
    }
  }
}
```
Response

```
{
  "data": {
    "hero": {
      "name": "R2-D2"
      "friends": [
        {
          "name": "Luke Skywalker"
        }...
    }
  }
}
```
`name` and `friends` are the field we asking for,
like SQL, you can add or remove field to see the new result.

### Arguments

Query

```
{
  human(id: "1000") {
    name
    height
  }
}
```

Response

```
{
  "data": {
    "human": {
      "name": "Luke Skywalker",
      "height": 1.72
    }
  }
}
```

Not like REST query, every field  and nested object in GraphQL can get its own set of arguments, you can even pass arguments into scalar fields, to implement data transformations once on the server, instead of on every client separately.

### Fragments

Query

```
{
  leftComparison: hero(episode: EMPIRE) {
    ...comparisonFields
  }
  rightComparison: hero(episode: JEDI) {
    ...comparisonFields
  }
}

fragment comparisonFields on Character {
  name
  appearsIn
  friends {
    name
  }
}
```

Response

```
{
  "data": {
    "leftComparison": {
      "name": "Luke Skywalker",
      "appearsIn": [
        "NEWHOPE",
        "EMPIRE",
        "JEDI"
      ],
      "friends": [
        {
          "name": "Han Solo"
        },
        {
          "name": "Leia Organa"
        },
        {
          "name": "C-3PO"
        },
        {
          "name": "R2-D2"
        }
      ]
    },
    "rightComparison": {
      "name": "R2-D2",
      "appearsIn": [
        "NEWHOPE",
        "EMPIRE",
        "JEDI"
      ],
      "friends": [
        {
          "name": "Luke Skywalker"
        },
        {
          "name": "Han Solo"
        },
        {
          "name": "Leia Organa"
        }
      ]
    }
  }
}
```

Fragments let you construct sets of fields, and then include them in queries where you need to, which can help you for repeat field to display.

### Operation name

```
query HeroNameAndFriends {
  hero {
    name
    friends {
      name
    }
  }
}
```
`HeroNameAndFriends` is operation name to describes the operation you intend to do.

### Variables

Query

```
query HeroNameAndFriends($episode: Episode) {
  hero(episode: $episode) {
    name
    friends {
      name
    }
  }
}
```

Variables

```
{
  "episode": "JEDI"
}
```

Response

```
{
  "data": {
    "hero": {
      "name": "R2-D2",
      "friends": [
        {
          "name": "Luke Skywalker"
        },
        {
          "name": "Han Solo"
        },
        {
          "name": "Leia Organa"
        }
      ]
    }
  }
}
```

`$episode` is a variable for query specify data pass by you.

Normally is setting as JSON format.

## Schema and Types

### Object types and fields

```
type Character {
  name: String!
  appearsIn: [Episode!]!
}
```

- `String`, `Boolean`...etc are scalar type in GraphQL, which is simple to understand.
- `Character` is GraphQL Object type, which means a type with some fields.
- `!` means this field is non-nullable, meaning that the GraphQL service promises to always give you a value when you query this field.
- `[]` means this response is an array of Object.

With all the GraphQL Object we have general name `Schema`.

### The Query types

Query

```
query DroidById($id: ID!) {
  droid(id: $id) {
    name
  }
}
```

- `ID!` same with `!` in type, means this parameter should not be null.

## Reference
* **[Query and Mutations](query_mutations.md)**
* **[Schemas and Types](schemas_types.md)**