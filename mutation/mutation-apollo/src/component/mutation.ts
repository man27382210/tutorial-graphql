import gql from 'graphql-tag'

export const createMessageSchema = gql`
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