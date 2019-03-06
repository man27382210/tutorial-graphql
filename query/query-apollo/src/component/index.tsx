import * as React from 'react'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloClient } from 'apollo-client'
import { ApolloProvider } from 'react-apollo'
import { App } from './App'

const graphqlUrl = 'http://localhost:3000/graphql'

const httpLink = createHttpLink({
  uri: graphqlUrl,
})

const cache = new InMemoryCache();

const client = new ApolloClient({
  cache,
  link: httpLink
})

export default () => (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
)
