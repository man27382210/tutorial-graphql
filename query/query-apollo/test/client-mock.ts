import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { SchemaLink } from 'apollo-link-schema'
import { makeExecutableSchema } from 'graphql-tools'

const cache = new InMemoryCache()

const schema = `
  type MessagePayload {
    messageEdge: MessageEdge
  }

  input MessageInput {
    content: String
    author: String
  }

  type PageInfo {
    startCursor: String
    endCursor: String
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
  }

  type Message {
    id: ID!
    content: String
    author: String
  }

  type MessageConnection {
    pageInfo: PageInfo
    edges: [MessageEdge]
    totalCount: Int
  }

  type MessageEdge {
    node: Message
    cursor: String
  }

  type Query {
    getMessage(first: Int): MessageConnection
    getMessageByPage(first: Int, after: String, last: Int, before: String): MessageConnection
  }

  type Mutation {
    createMessage(input: MessageInput): MessagePayload
  }

  type Subscription {
    messageCreated: MessagePayload
  }
`

const resolvers = {
  Query: {
    getMessage: () => ({
      edges: [
        {
          node: {
            id: "f303b555c9d1f9f97160",
            author: "Davis",
            content: "init content1"
          }
        }
      ]
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
