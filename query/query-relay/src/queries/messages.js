import { graphql } from 'react-relay'

export const messages =  graphql`
  fragment messagesFragment on MessageConnection {
    edges {
      ...nodeFragment
    }
  }
`