import * as React from 'react'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import { withStyles, WithStyles, createStyles } from '@material-ui/core/styles'
import { GetSWPersonByPersonID, GetSWPersonByPersonIDVariables } from './--schema/GetSWPersonByPersonID'
import { shipInfo } from './--schema/shipInfo'
import { SWPersonQUERY } from './queries'
import { Query } from 'react-apollo'

export class SWPerson extends Query<GetSWPersonByPersonID, GetSWPersonByPersonIDVariables> {}

export const searchStyle = () => createStyles({
  pre: {
    margin: 0,
  },
  infoPaper: {
    padding: 20,
    minHeight: 100,
  }
})

export interface Props extends WithStyles<typeof searchStyle> {}

export interface State {
  personID: string
  loading: boolean
}

export interface GraphQLPersonProps extends Partial<Props> {
  personID: string
}

const renderNoData = () => <div>No data</div>
const renderLoading = () => <div>Loading</div>
const renderError = () => <h1>ERROR</h1>

export const GraphQLPerson = (props: GraphQLPersonProps) => {
  const { personID } = props
  return (
    <SWPerson query={SWPersonQUERY} variables={{personID}}>
      {({ loading, data, error }) => {
        if (loading) return renderLoading()
        if (error) return renderError()
        if (!data) return renderNoData()
        const { person } = data
        return person ? (
          <div>
            <div>{person.name}</div>
            <div>Star Ship:</div>
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
          </div>
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
    }
    personIDInput = React.createRef<HTMLInputElement>()

    submitPerson = () => {
      if (this.personIDInput.current) {
        this.setState({personID: this.personIDInput.current.value, loading: false})
      }
    }

    render() {
      const { classes } = this.props
      const { loading, personID } = this.state
      return (
        <Grid container spacing={24}>
          <Grid container item xs={12}>
            <Paper>
              Apollo POST
            </Paper>
          </Grid>
          <Grid container item xs={6} spacing={16}>
            <Grid item xs={6}>
              <Paper className={classes.infoPaper}>
                <input ref={this.personIDInput} defaultValue='1'/>
                <button onClick={this.submitPerson}> GET Person </button>
              </Paper>
            </Grid>
            <Grid item xs={6}>
              <Paper className={classes.infoPaper}>
                {!loading && personID.length > 0
                  ? <GraphQLPerson {...{personID}}/>
                  : renderLoading()
                }
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      )
    }
  }
)

export default App