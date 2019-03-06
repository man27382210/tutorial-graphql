import { graphql } from 'react-relay'

export const getMessagesQuery =  graphql`
  query getMessagesQuery($first: Int, $after: String, $last: Int, $before: String) {
    getMessageByPage(first: $first, $after, $last, $before) @connection(key: "messages_getMessage") {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        cursor
        node {
          id
          content
          author
        }
      }
      totalCount
    }
  }
`