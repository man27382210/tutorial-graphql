import React from 'react'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import { QueryRenderer } from 'react-relay'
import { modernEnvironment } from '../env'
import { getMessagesQuery } from '../query/getMessages'
import { requestSub } from '../subscription/createMessage'
import { searchStyle } from '../util/style'

const Messages = props => {
  const { messages } = props
  console.log(messages)
  return (
    <ul>
      {messages.edges.map((msg, index) => (
        <li key={`message-${index}`}>
          <div>{msg.node.id}</div>
          <div>{msg.node.content}</div>
        </li>
      ))}
    </ul>
  )
}

class AllMessageQuery extends React.Component {
  componentDidMount() {
    requestSub()
  }
  render () {
    const { classes } = this.props
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
            return <Paper className={classes.infoPaper}><Messages messages={props.getMessage}/></Paper>
          } else {
            return <Paper className={classes.infoPaper}><div>Loading</div></Paper>
          }
        }}
      />
    )
  }
}
  

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
