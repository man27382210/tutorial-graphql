import { graphql } from 'react-relay';

export const ShipInfo = graphql`
  fragment shipInfoFragment on Starship {
    name
    starshipClass
  }
`