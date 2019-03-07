import { Environment, Network, RecordSource, Store } from 'relay-runtime'
import 'whatwg-fetch'

const GRAPHQL_SERVER = 'http://localhost:3000/graphql'

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

export const modernEnvironment = new Environment({
  network: Network.create(fetchQuery),
  store: new Store(new RecordSource()),
})