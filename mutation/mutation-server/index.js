var express = require('express');
var express_graphql = require('express-graphql');
var { buildSchema } = require('graphql');
var cors = require('cors')

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
  }

  type MessageEdge {
    node: Message
    cursor: String
  }

  type Query {
    getMessage(first: Int): MessageConnection
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

// Maps username to content
var fakeDatabase = {
  [createId()]: {
    content: 'init content',
    author: 'Davis'
  }
};

var root = {
  getMessage: function ({first}) {
    if (Object.keys(fakeDatabase).length == 0) throw new Error('no message exists with id ');
    return { edges: Object.keys(fakeDatabase).map((id) => ({ node: new Message(id, fakeDatabase[id]) })) }
  },
  createMessage: function ({input}) {
    // Create a random id for our "database".
    var id = createId();

    fakeDatabase[id] = input;
    return {messageEdge: {node: new Message(id, input)}}
  },
};

var app = express();
app.use(cors())
app.use('/graphql', express_graphql({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

app.listen(4000, () => {
  console.log('Running a GraphQL API server at localhost:4000/graphql');
});
