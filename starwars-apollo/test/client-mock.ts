import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { SchemaLink } from 'apollo-link-schema'
import { makeExecutableSchema } from 'graphql-tools'

const cache = new InMemoryCache()

const schema = `
  type Query {
    person(personID: ID): Person
  }

  type Person {
    id: ID
    name: String
    filmConnection: FilmConnection
    starshipConnection: StarshipConnection
  }

  type FilmConnection {
    films: [Film]
  }

  type Film {
    title: String
    episodeID: Int
  }

  type StarshipConnection {
    starships: [Starship]
    totalCount: Int
  }

  type Starship {
    name: String
    starshipClass: String
  }
`

export const resolvers = {
  Query: {
    person: () => ({
      id: 'cGVvcGxlOjE=',
      name: 'Luke Skywalker',
      filmConnection: {
        films: [
          {
            title: 'A New Hope',
            episodeID: 4
          }
        ]
      },
      starshipConnection:{
        starships:[  
          {  
            name: "X-wing",
            starshipClass: "Starfighter"
          }
        ],
        totalCount: 1
      }
    })
  }
}

const executableSchema = makeExecutableSchema({
  typeDefs: schema,
  resolvers,
  resolverValidationOptions: {
    requireResolversForResolveType: false,
  },
})

export default new ApolloClient({
  link: new SchemaLink({ schema: executableSchema }),
  cache,
})
