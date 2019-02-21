import React from 'react'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import { QueryRenderer } from 'react-relay'
import { modernEnvironment } from '../env'
import { getMessagesQuery } from '../query/getMessages'
import { CreateMessage } from './CreateMessage'
import { searchStyle } from '../util/style'

const Messages = props => {
  const { edges: messages } = props
  return (
    <ul>
      {messages.map((msg, index) => (
        <li key={`message-${index}`}>
          <div>{msg.node.id}</div>
          <div>{msg.node.author}</div>
          <div>{msg.node.content}</div>
        </li>
      ))}
    </ul>
  )
}

export const AllMessageQuery = searchStyle((props) => {
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
        console.log(props)
        if (props && props.getMessage) {
          return <Paper className={classes.infoPaper}><Messages edges={props.getMessage.edges}/></Paper>
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
            <CreateMessage />
          </Grid>
          <Grid item xs={6}>
            <AllMessageQuery classes={classes} />
          </Grid>
        </Grid>
      </Grid>
    )
  }

export default searchStyle(MessageApp)
