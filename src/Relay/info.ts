import { graphql } from 'react-relay';

export const Info = graphql`
  fragment infoFragment on Person {
    id
    name
    filmConnection {
      films {
        title
        episodeID
      }
    }
    starshipConnection {
      starships {
        ...shipInfoFragment
      }
      totalCount
    }
  }
`
