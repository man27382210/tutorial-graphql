import { graphql } from 'react-relay'

export const personQuery =  graphql`
  query GetSWPersonByPersonIDQuery($personID: ID){
    person(personID: $personID) {
      id
    }
  }
`
