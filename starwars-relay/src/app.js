/**
 * This file provided by Facebook is for non-commercial testing and evaluation
 * purposes only.  Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

// import 'todomvc-common'

import React from 'react'
import ReactDOM from 'react-dom'

import 'whatwg-fetch'

import {QueryRenderer} from 'react-relay'
import {Environment, Network, RecordSource, Store} from 'relay-runtime'

import { personQuery } from './component/GetSWPersonByPersonID'

// import TodoApp from './components/TodoApp'

function fetchQuery(operation, variables) {
  return fetch('http://localhost:5000/', {
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

const modernEnvironment = new Environment({
  network: Network.create(fetchQuery),
  store: new Store(new RecordSource()),
})

ReactDOM.render(
  <QueryRenderer
    environment={modernEnvironment}
    query={personQuery}
    variables={{personID: 1}}
    render={({error, props}) => {
      console.log(error)
      console.log(props)
      if (error) {
        return <div>{error}</div>
      }
      if (props && props.person) {
        return <div>{props.person.id}</div>
      } else {
        return <div>Loading</div>
      }
    }}
  />,
  document.getElementById('root'),
)
