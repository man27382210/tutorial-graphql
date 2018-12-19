import { graphql } from 'react-relay';

export const SWPersonQuery = graphql`
  query GetSWPersonByPersonIDQuery($personID: ID){
    person(personID: $personID) {
      ...infoFragment
    }
  }
`
