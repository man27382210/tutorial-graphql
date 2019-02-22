import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { SchemaLink } from 'apollo-link-schema'
import { makeExecutableSchema } from 'graphql-tools'

const cache = new InMemoryCache()

const schema = `
  type Message {
    id: ID!
    content: String
    author: String
  }

  type MessageConnection {
    pageInfo: PageInfo
    edges: [MessageEdge]
  }

  type MessageEdge {
    node: Message
    cursor: String
  }

  input MessageInput {
    content: String
    author: String
  }

  type MessagePayload {
    messageEdge: MessageEdge
  }

  type Mutation {
    createMessage(input: MessageInput): MessagePayload
  }

  type PageInfo {
    startCursor: String
    endCursor: String
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
  }

  type Query {
    getMessage(first: Int): MessageConnection
  }
`

const resolvers = {
  Query: {
    getMessage: () => ({
      edges: [
        {
          node: {
            id: '55a248e46f0b57f48e27',
            content: 'init content',
            author: 'Davis'
          }
        }
      ]
    })
  },
  Mutation: {
    createMessage: () => ({
      createMessage: {
        messageEdge: {
          node: {
            author: "andy",
            id: "008c542c4d78c2725706",
            content: "but we don't have it"
          }
        }
      },
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
