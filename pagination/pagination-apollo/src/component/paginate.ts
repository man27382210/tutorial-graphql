import gql from 'graphql-tag'

export const messageQUERY = gql`
  query GetMessage($first: Int, $after: String, $last: Int, $before: String) {
    getMessage(first: $first, after: $after, last: $last, before: $before) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
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


