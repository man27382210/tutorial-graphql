import { graphql } from 'react-relay';

export const Info = graphql`
  fragment shipInfoFragment on Starship {
    name
    starshipClass
  }
`
