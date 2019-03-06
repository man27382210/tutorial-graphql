import React from 'react'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import { QueryRenderer } from 'react-relay'
import { modernEnvironment } from '../env'
import { getMessagesQuery } from '../pagination/getMessages'
import { MessagePaginationContainer } from './pagination'
import { searchStyle } from '../util/style'

const AllMessageQuery = searchStyle((props) => {
  const { classes } = props
  return (
    <QueryRenderer
      environment={modernEnvironment}
      query={getMessagesQuery}
      variables={{first: 2}}
      render={({error, props}) => {
        if (error) {
          return <Paper className={classes.infoPaper}><div>Error</div></Paper>
        }
        if (props) {
          return (
          <Paper className={classes.infoPaper}>
            <MessagePaginationContainer data={props} />
          </Paper>)
        } else {
          return <Paper className={classes.infoPaper}><div>Loading</div></Paper>
        }
      }}
    />
  )
})

const MessageApp = props => {
    const { classes } = props
    return (
      <Grid container spacing={24}>
        <Grid container item xs={6} spacing={16}>
          <Grid item xs={6}>
            <AllMessageQuery classes={classes} />
          </Grid>
        </Grid>
      </Grid>
    )
  }

export default searchStyle(MessageApp)
