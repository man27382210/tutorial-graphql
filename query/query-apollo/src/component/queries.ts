import gql from 'graphql-tag'

export const messageQUERY = gql`
  query getMessage {
    getMessage {
      edges {
        node {
          id
          author
          content
        }
      }
    }
  }
`
