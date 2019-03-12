import { commitMutation, graphql } from 'react-relay'
import { ConnectionHandler } from 'relay-runtime'
import { modernEnvironment as environment } from '../env'

export const createMessageSchema = graphql`
  mutation CreateMessageMutation($input: MessageInput!) {
    createMessage(input: $input) {
      messageEdge {
        node {
          id
          content
          author
        }
      }
    }
  }
`

const sharedUpdater = (store, newEdge) => {
  const connectionProxy = store.getRoot()
  const conn = ConnectionHandler.getConnection(
    connectionProxy,
    'messages_getMessage',
  )
  ConnectionHandler.insertEdgeAfter(conn, newEdge)
}


export const createMessageMutation = (author, content, callback) => {
  const variables = {
    input: {
      author,
      content,
    },
  }

  return commitMutation(
    environment,
    {
      mutation: createMessageSchema,
      variables,
      onCompleted: (response, errors) => {
        if(errors) console.log('errors received from server: ', errors)
        console.log('Response received from server: ', response)
        callback()
      },
      onError: err => console.error(err),
      updater: (store) => {
        const payload = store.getRootField('createMessage')
        const newEdge = payload.getLinkedRecord('messageEdge')
        sharedUpdater(store, newEdge)
      },
      optimisticUpdater: (store) => {
        const id = 'node_cursor_xxxx'
        const node = store.create(id, 'Message')
        node.setValue(id, 'id')
        node.setValue(content, 'content')
        node.setValue(author, 'author')
        const newEdge = store.create(
          'edge_cursor_xxxx',
          'messageEdge',
        )
        newEdge.setLinkedRecord(node, 'node')
        sharedUpdater(store, newEdge)
      },
    }
  )
}
