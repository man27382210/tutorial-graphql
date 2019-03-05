import gql from 'graphql-tag'

export const SWPersonQUERY = gql`
  query GetSWPersonByPersonID($personID: ID){
    person(personID: $personID) {
      ...info
    }
  }
  fragment info on Person {
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
        ...shipInfo
      }
      totalCount
    }
  }
  fragment shipInfo on Starship {
      name
      starshipClass
  }
`
