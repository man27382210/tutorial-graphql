import gql from 'graphql-tag'

export const messageQUERY = gql`
  query GetMessage($first: Int, $after: String, $last: Int, $before: String) {
    getMessageByPage(first: $first, after: $after, last: $last, before: $before) {
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
