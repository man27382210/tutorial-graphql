import React from 'react'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import { QueryRenderer } from 'react-relay'
import { modernEnvironment } from '../env'
import { getMessagesQuery } from '../queries/getMessages'
import MessageFragment from './MessageFragment'
import { searchStyle } from '../util/style'

export const MessageQuery = searchStyle((props) => {
  const { classes } = props
  return (
    <QueryRenderer
      environment={modernEnvironment}
      query={getMessagesQuery}
      variables={{}}
      render={({error, props}) => {
        if (error) {
          return <Paper className={classes.infoPaper}><div>Error</div></Paper>
        }
        if (props && props.getMessage) {
          return <MessageFragment data={props.getMessage}/>
        } else {
          return <Paper className={classes.infoPaper}><div>Loading</div></Paper>
        }
      }}
    />
  )
})

class MessageApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    }
  }
  render() {
    const { classes } = this.props
    const { loading } = this.state
    return (
      <Grid container spacing={24}>
        <Grid container item xs={6} spacing={16}>
          <Grid item xs={6}>
            <Paper className={classes.infoPaper}>
              <button onClick={this.fetchPerson}>GET Message</button>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            {!loading
            ? <MessageQuery />
            : <Paper className={classes.infoPaper}><div>Loading</div></Paper>}
          </Grid>
        </Grid>
      </Grid>
    )
  }
  fetchPerson = () => {
    this.setState({ loading: false })
  }
}

export default searchStyle(MessageApp)
