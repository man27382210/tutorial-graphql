import {
  Environment,
  Network,
  RecordSource,
  Store,
  RequestNode,
  Variables,
} from 'relay-runtime'


function fetchQuery(
  operation: RequestNode,
  variables: Variables,
) {
  return fetch('http://localhost:5000/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      query: operation.text,
      variables
    }),
  }).then(response => {
    return response.json()
  })
}

const environment = new Environment({
  network: Network.create(fetchQuery),
  store: new Store(new RecordSource()),
})

export default environment
