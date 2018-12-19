import * as React from 'react';
import { render } from 'react-dom';
import PersonApp from './Basic/App';
import PersonApolloApp from './Apollo/index';
import PersonRelayApp from './Relay/index';

const App = () => (
  <React.Fragment>
    <PersonApp />
    <PersonApolloApp />
    <PersonRelayApp />
  </React.Fragment>
)

render(<App />, document.getElementById('basic'));
