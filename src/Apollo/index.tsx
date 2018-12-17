import * as React from 'react';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from 'react-apollo';
import { App } from './App';

const graphqlUrl = 'http://localhost:5000/grahpql'

const httpLink = createHttpLink({
  uri: graphqlUrl,
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: httpLink
});

export const PersonApolloApp = () => (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
