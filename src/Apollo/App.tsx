import * as React from 'react';
import Paper from '@material-ui/core/Paper';
import { withStyles, WithStyles, createStyles } from '@material-ui/core/styles';
import { GetSWPersonByPersonID, GetSWPersonByPersonIDVariables } from './--schema/GetSWPersonByPersonID';
import { shipInfo } from './--schema/shipInfo'
import { SWPersonQUERY as QUERY } from './queries';
import { Query } from 'react-apollo';

class SWPerson extends Query<GetSWPersonByPersonID, GetSWPersonByPersonIDVariables> {}

const searchStyle = () => createStyles({
  pre: {
    margin: 0,
  },
  infoPaper: {
    padding: 20,
    minHeight: 100,
  }
})

interface Props extends WithStyles<typeof searchStyle> {}

interface State {
  personID: string
  loading: boolean
  error: boolean
}

interface GraphQLPersonProps extends Props {
  personID: string 
}

const renderNoData = () => <div>No data</div>
const renderLoading = () => <div>Loading</div>
const renderError = () => <h1>ERROR</h1>

const GraphQLPerson = (props: GraphQLPersonProps) => {
  const { personID, classes } = props
  return (
    <SWPerson query={QUERY} variables={{personID}}>
      {({ loading, data, error }) => {
        if (loading) return renderLoading();
        if (error) return <h1>ERROR</h1>; 
        if (!data) return renderNoData();
        const { person } = data;
        return person ? (
          <Paper className={classes.infoPaper}>
            <div>{person.name}</div>
            <div>Start ship:</div>
            <ul>
              {person.starshipConnection &&
              person.starshipConnection.starships &&
              person.starshipConnection.starships.length > 0
                ? person.starshipConnection.starships
                    .map((ship: shipInfo, shipIndex: number)  => 
                    (
                      <li key={`shipIndex-${shipIndex}`}>
                        <div>{ship.name}</div>
                      </li>
                    ))
                : renderNoData()
              }
            </ul>
          </Paper>
        ) : renderNoData()
      }}
    </SWPerson>
  )
}

export const App = withStyles(searchStyle)(
  class extends React.Component<Props, State> {
    state = {
      personID: '',
      loading: true,
      error: false,
    }
    personIDInput = React.createRef<HTMLInputElement>();

    submitPerson = () => {
      if (this.personIDInput.current) {
        this.setState({personID: this.personIDInput.current.value, loading: false})
      }
    }

    render() {
      const { classes } = this.props
      const { loading, error, personID } = this.state
      console.log(personID)
      return (
        <React.Fragment>
          <Paper className={classes.infoPaper}>
          <input ref={this.personIDInput} defaultValue='1'/>
          <button onClick={this.submitPerson}> GET Person </button>
        </Paper>
        <Paper>
          {error
            ? renderError()
            : !loading && personID.length > 0
              ? <GraphQLPerson {...{classes, personID}}/>
              : renderLoading()
          }
        </Paper>
        </React.Fragment>
      );
    }
  }
);

export default App;
