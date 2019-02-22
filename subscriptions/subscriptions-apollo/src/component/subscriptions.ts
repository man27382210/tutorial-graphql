import gql from 'graphql-tag'

export const subscriptionMessageSchema = gql`
  subscription MessageSubscription {
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