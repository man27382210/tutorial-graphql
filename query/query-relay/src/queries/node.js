import { graphql } from 'react-relay'

export const node =  graphql`
  fragment nodeFragment on MessageEdge {
    node {
      id
      author
      content
    }
  }
`