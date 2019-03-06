import express from 'express'
import { createServer } from 'http'
import { PubSub } from 'apollo-server'
import { ApolloServer, gql } from 'apollo-server-express'
import _ from 'lodash'
const cors = require('cors')

const app = express()
app.use(cors())

const pubsub = new PubSub()
const MESSAGE_CREATED = 'MESSAGE_CREATED'

var typeDefs = gql`
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

var fakeDatabase = [
  {
    id: createId(),
    content: 'init content1',
    author: 'Davis',
  },
  {
    id: createId(),
    content: 'init content2',
    author: 'Davis',
  },
  {
    id: createId(),
    content: 'init content3',
    author: 'Davis',
  },
  {
    id: createId(),
    content: 'init content4',
    author: 'Davis',
  },
  {
    id: createId(),
    content: 'init content5',
    author: 'Davis',
  },
  {
    id: createId(),
    content: 'init content6',
    author: 'Davis',
  },
  {
    id: createId(),
    content: 'init content7',
    author: 'Davis',
  }
]

var fakeDatabaseIndexObj = {}
fakeDatabase.forEach((message, index) => {
  fakeDatabaseIndexObj[message.id] = index
})

var resolvers = {
  Query: {
    getMessage: function (__, { first }) {
      if (fakeDatabase.length == 0) throw new Error('no message exists with id ')
      return {
        edges: fakeDatabase.map(
          (message) => {
            return {
              cursor: message.id,
              node: {
                ...new Message(message.id, { content: message.content, author: message.author })
              }
            }
          }
        )
      }
    },
    getMessageByPage: function (__, pageInfo) {
      const edges = fakeDatabase.map(
        (message) => {
          return {
            cursor: message.id,
            node: {
              ...new Message(message.id, { content: message.content, author: message.author })
            }
          }
        }
      )
  
      const returnEdges = {
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
          startCursor: null,
          endCursor: null
        },
        edges: [],
        totalCount: edges.length,
      }

      if (!Object.keys(pageInfo).length) return {
        ...returnEdges,
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
          startCursor: edges[0].cursor,
          endCursor: edges[edges.length - 1].cursor
        },
        edges,
      }
      
      const {
        first,
        after,
        last,
        before
      } = pageInfo
      
      var afterIndex = after && typeof fakeDatabaseIndexObj[after] !== 'undefined'
        ? fakeDatabaseIndexObj[after] + 1
        : 0
      var beforeIndex = before && typeof fakeDatabaseIndexObj[before] !== 'undefined'
        ? fakeDatabaseIndexObj[before]
        : edges.length
      
      if (afterIndex >= beforeIndex) return returnEdges
  
      const sliceEdges = _.slice(edges, afterIndex, beforeIndex)
      const leftEdges = first
        ? _.slice(sliceEdges, 0, first)
        : []
      const rightEdges = last
        ? _.slice(sliceEdges, sliceEdges.length - last)
        : []
      const finalEdges = _.concat(leftEdges, rightEdges)
      const startCursor = finalEdges[0].cursor
      const endCursor = finalEdges[finalEdges.length -1].cursor
      const hasNextPage =  fakeDatabaseIndexObj[endCursor] < edges.length - 1
      const hasPreviousPage = fakeDatabaseIndexObj[startCursor] > 0
      return {
        ...returnEdges,
        pageInfo: {
          hasNextPage,
          hasPreviousPage,
          startCursor,
          endCursor
        },
        edges: finalEdges,
      }
    }
  },
  Subscription: {
    messageCreated: {
      subscribe: () => pubsub.asyncIterator(MESSAGE_CREATED),
    }
  },
  Mutation: {
    createMessage: function (__, { input }) {
      var id = createId()
      fakeDatabase.push({id, ...input})
      fakeDatabaseIndexObj[id] = fakeDatabase.length
      return {messageEdge: {cursor: id, node: new Message(id, input)}}
    },
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.applyMiddleware({ app, path: '/graphql' })

const httpServer = createServer(app)
server.installSubscriptionHandlers(httpServer)

httpServer.listen({ port: 3000 }, () => {
  console.log('Apollo Server on http://localhost:3000/graphql')
})


setInterval(() => {
  const id = createId()
  pubsub.publish(MESSAGE_CREATED, {
    messageCreated: {
      messageEdge: {
        cursor: id,
        node: new Message(id, {
          author: 'davis', content: new Date().toString()
        })
      }
    }
  })
}, 1000)
