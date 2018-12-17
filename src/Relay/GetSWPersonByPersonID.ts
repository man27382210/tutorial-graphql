// import { graphql, createFragmentContainer } from 'react-relay';

// export const SWPersonQuery = graphql`
//   query GetSWPersonByPersonIDQuery($personID: ID){
//     person(personID: $personID) {
//       id
//       name
//       filmConnection {
//         films {
//           title
//           episodeID
//         }
//       }
//     }
//   }
// `;

// fragment info on Person {
//   id
//   name
//   filmConnection {
//     films {
//       title
//       episodeID
//     }
//   }
//   starshipConnection {
//     starships {
//       ...shipInfo
//     }
//     totalCount
//   }
// }
// fragment shipInfo on Starship {
//     name
//     starshipClass
// }
