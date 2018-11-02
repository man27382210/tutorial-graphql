import * as React from 'react';
import { render } from 'react-dom';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from 'react-apollo';
// import requestData, { RequestDataMethod } from 'r/requestData';
import { fetch } from 'whatwg-fetch';
import { App } from './App';

const isProd: boolean = process.env.NODE_ENV === 'production';
const graphqlUrl: string = isProd
  ? 'https://stg.gateway-api.intra.rakuten-it.com/ecsg/keyauth/graphql'
  : 'http://ecsg.rwasp.hnd1.bdd.local/graphql';

const httpLink = createHttpLink({
  uri: graphqlUrl,
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      Authorization: '48e4c818ed2c9db04330c8e7',
    }
  }
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: isProd
    ? authLink.concat(httpLink)
    : httpLink,
});

const postGraphQL:() => void = (): void => {
  const body: { [s: string]: string | number | {} } = {
    operationName: "GetRaceWithSourceId",
    variables: {
      sourceId: "70",
      deviceType: "pc",
      easyId: 351177435
    },
    query: "query GetRaceWithSourceId($sourceId: String!, $deviceType: String) {\n  race(sourceId: $sourceId, deviceType: $deviceType) {\n    status\n    revision\n    contentsType {\n      targetId\n      targetContent {\n        landingUrl\n        bannerUrl\n        altString\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n"
  };
  // requestData(graphqlUrl, {
  //   method: RequestDataMethod.POST,
  //   headers: {
  //     'content-type': 'application/json'
  //   },
  //   body,
  // })
  // .then((res: Response) => res.json())
  // .then((result: {[s: string]: string}) => console.log('request data result: ', result))
  // .catch((e: Error) => console.log('e request data: ', e));

  fetch(graphqlUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body),
  })
  .then((res: Response) => res.json())
  .then((result: {[s: string]: string}) => console.log('fetch data result: ', result))
  .catch((e: Error) => console.log('e fetch: ', e));
};

postGraphQL();

const WrappedApp = (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);

render(WrappedApp, document.getElementById('root'));
