import gql from 'graphql-tag'

export const messageQUERY = gql`
  query GetMessage {
    getMessage {
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


