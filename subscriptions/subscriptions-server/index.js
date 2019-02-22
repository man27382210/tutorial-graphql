import express from 'express'
import { createServer } from 'http'
import { PubSub } from 'apollo-server'
import { ApolloServer, gql } from 'apollo-server-express'
const cors = require('cors')

const app = express()
app.use(cors())

const pubsub = new PubSub()
const MESSAGE_CREATED = 'MESSAGE_CREATED'

var typeDefs = gql`
  type MessagePayload {
    messageEdge: MessageEdge
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
  }

  type MessageEdge {
    node: Message
    cursor: String
  }

  type Query {
    getMessage(first: Int): MessageConnection
  }

  type Subscription {
    messageCreated: MessagePayload
  }
`

// If Message had any complex fields, we'd put them on this object.
class Message {
  constructor(id, {content, author}) {
    this.id = id
    this.content = content
    this.author = author
  }
}

function createId() {
  return require('crypto').randomBytes(10).toString('hex')
}

var resolvers = {
  Query: {
    getMessage: function (first) {
      return { edges: [{ node: new Message(createId(), {author: 'davis', content: 'test'})}]}
    }
  },
  Subscription: {
    messageCreated: {
      subscribe: () => pubsub.asyncIterator(MESSAGE_CREATED),
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.applyMiddleware({ app, path: '/graphql' })

const httpServer = createServer(app)
server.installSubscriptionHandlers(httpServer)

httpServer.listen({ port: 8000 }, () => {
  console.log('Apollo Server on http://localhost:8000/graphql')
})


setInterval(() => {
  pubsub.publish(MESSAGE_CREATED, {
    messageCreated: {messageEdge: {node: new Message(createId(), {author: 'davis', content: new Date().toString()})}}
  })
}, 1000)
