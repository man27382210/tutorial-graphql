import { graphql } from 'react-relay'

export const getMessagesQuery =  graphql`
  query getMessagesQuery($first: Int) {
    getMessage(first: $first) @connection(key: "messages_getMessage") {
      edges {
        node {
          id
          content
          author
        }
      }
    }
  }
`