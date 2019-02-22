import { modernEnvironment } from '../env'
import {
  requestSubscription,
  graphql,
} from 'react-relay'
import { ConnectionHandler } from 'relay-runtime'

export const createMessageSchema = graphql`
  subscription createMessageSubscription {
    messageCreated {
      messageEdge {
        node {
          id
          author
          content
        }
      }
    }
  }
`

export const requestSub = () => requestSubscription(
  modernEnvironment,
  {
    subscription: createMessageSchema,
    variables: {},
    updater: (store) => {
      const payload = store.getRootField('messageCreated')
      const newEdge = payload.getLinkedRecord('messageEdge')
      const connectionProxy = store.getRoot()
      const conn = ConnectionHandler.getConnection(
        connectionProxy,
        'messages_getMessage',
      )
      ConnectionHandler.insertEdgeAfter(conn, newEdge)
    },
  }
)

