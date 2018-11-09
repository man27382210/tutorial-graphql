import gql from 'graphql-tag';

export const RACE_QUERY = gql`
  query GetRaceWithSourceId($sourceId: String!, $deviceType: String) {
    race(sourceId: $sourceId, deviceType: $deviceType) {
      status
      revision
      contentsType {
        targetId
        targetContent {
          landingUrl
          bannerUrl
          altString
        }
      }
    }
  }
`;
