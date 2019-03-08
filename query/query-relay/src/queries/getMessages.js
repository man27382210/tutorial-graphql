import { graphql } from 'react-relay'

export const getMessagesQuery =  graphql`
  query getMessagesQuery {
    getMessage {
      ...messagesFragment
    }
  }
`