import { graphql } from 'react-relay'

export const messages =  graphql`
  fragment messagesFragment on Query {
    getMessageByPage(
      first: $first,
      after: $after,
    ) @connection(key: "messages_getMessageByPage") {
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