import React from 'react'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import { QueryRenderer } from 'react-relay'
import { modernEnvironment } from '../env'
import { personQuery } from '../queries/GetSWPersonByPersonID'
import InfoFragment from './InfoFragment'
import { searchStyle } from '../util/style'

export const PersonQuery = searchStyle((props) => {
  const { classes } = props
  return (
    <QueryRenderer
      environment={modernEnvironment}
      query={personQuery}
      variables={{personID: props.personID}}
      render={({error, props}) => {
        if (error) {
          return <Paper className={classes.infoPaper}><div>Error</div></Paper>
        }
        if (props && props.person) {
          return <InfoFragment data={props.person}/>
        } else {
          return <Paper className={classes.infoPaper}><div>Loading</div></Paper>
        }
      }}
    />
  )
})

class PersonApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      personID: null,
    }
    this.idRef = React.createRef();
  }
  render() {
    const { classes } = this.props
    const { personID } = this.state
    return (
      <Grid container spacing={24}>
        <Grid container item xs={12}>
          <Paper>
            relay POST
          </Paper>
        </Grid>
        <Grid container item xs={6} spacing={16}>
          <Grid item xs={6}>
            <Paper className={classes.infoPaper}>
              <input ref={this.idRef} defaultValue='1' />
              <button onClick={this.fetchPerson}>GET Person</button>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            {personID
            ? <PersonQuery personID={personID} />
            : <Paper className={classes.infoPaper}><div>Loading</div></Paper>}
          </Grid>
        </Grid>
      </Grid>
    )
  }
  fetchPerson = () => {
    if (this.idRef.current) {
      const { value } = this.idRef.current
      this.setState({ personID: value })
    }
  }
}

export default searchStyle(PersonApp)
