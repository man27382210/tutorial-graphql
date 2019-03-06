import { graphql } from 'react-relay'

export const getMessagesQuery =  graphql`
  query getMessagesQuery($first: Int) {
    getMessage(first: $first) {
      ...messagesFragment
    }
  }
`