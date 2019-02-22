import { execute } from 'apollo-link'
import { Environment, Network, RecordSource, Store } from 'relay-runtime'
import { WebSocketLink } from 'apollo-link-ws'
import { SubscriptionClient } from 'subscriptions-transport-ws'
import 'whatwg-fetch'

const GRAPHQL_SERVER = 'http://localhost:8000/graphql'
const GRAPHQL_SUBSCRIPTION = 'ws://localhost:8000/graphql'

function fetchQuery(operation, variables) {
  return fetch(GRAPHQL_SERVER, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: operation.text,
      variables,
    }),
  }).then(response => {
    return response.json()
  })
}

const subscriptionClient = new SubscriptionClient(GRAPHQL_SUBSCRIPTION, {
  reconnect: true,
});

const subscriptionLink = new WebSocketLink(subscriptionClient);

// Prepar network layer from apollo-link for graphql subscriptions
const networkSubscriptions = (operation, variables) =>
  execute(subscriptionLink, {
    query: operation.text,
    variables,
  });

export const modernEnvironment = new Environment({
  network: Network.create(fetchQuery, networkSubscriptions),
  store: new Store(new RecordSource()),
})
