import * as React from 'react';
import { render } from 'react-dom';
import PersonApp from './Basic/App';
import { PersonApolloApp } from './Apollo/index';

const App = () => (
  <React.Fragment>
    <PersonApp />
    <PersonApolloApp />
  </React.Fragment>
)

render(<App />, document.getElementById('basic'));
