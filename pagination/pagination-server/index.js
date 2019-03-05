var express = require('express');
var express_graphql = require('express-graphql');
var { buildSchema } = require('graphql');
var cors = require('cors');
var _ = require('lodash');

var schema = buildSchema(`
  type MessagePayload {
    messageEdge: MessageEdge
  }

  type PageInfo {
    startCursor: String
    endCursor: String
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
  }

  input MessageInput {
    content: String
    author: String
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
`);

// If Message had any complex fields, we'd put them on this object.
class Message {
  constructor(id, {content, author}) {
    this.id = id;
    this.content = content;
    this.author = author;
  }
}

function createId() {
  return require('crypto').randomBytes(10).toString('hex');
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
];

var fakeDatabaseIndexObj = {}
fakeDatabase.forEach((message, index) => {
  fakeDatabaseIndexObj[message.id] = index
})

var root = {
  getMessage: function ({first}) {
    if (fakeDatabase.length == 0) throw new Error('no message exists with id ');
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
  createMessage: function ({input}) {
    // Create a random id for our "database".
    var id = createId();
    fakeDatabase.push({id, ...input});
    fakeDatabaseIndexObj[id] = fakeDatabase.length
    return {messageEdge: {node: new Message(id, input)}}
  },
  getMessageByPage: function (pageInfo) {
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
        hasNextPage: true,
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
};

var app = express();
app.use(cors())
app.get('/', (req, res) => res.send('hello'));
app.use('/graphql', express_graphql({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

app.listen(4000, () => {
  console.log('Running a GraphQL API server at localhost:4000/graphql');
});
