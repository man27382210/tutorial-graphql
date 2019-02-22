import * as React from 'react'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import { withStyles, WithStyles, createStyles } from '@material-ui/core/styles'
import { GetMessage, GetMessage_getMessage_edges } from './--schema/GetMessage'
import { messageQUERY } from './queries'
import { subscriptionMessageSchema } from './subscriptions'
import { Query } from 'react-apollo'

export const searchStyle = () => createStyles({
  pre: {
    margin: 0,
  },
  infoPaper: {
    padding: 20,
    minHeight: 100,
  }
})

interface Props extends WithStyles<typeof searchStyle> {}

const renderNoData = () => <div>No data</div>
const renderLoading = () => <div>Loading</div>
const renderError = () => <h1>ERROR</h1>

class Messages extends React.Component<{messages: (GetMessage_getMessage_edges | null)[], subscribeToMore: ()=>void}> {
  componentDidMount() {
    this.props.subscribeToMore()
  }

  render() {
    const { messages } = this.props
    return(
      <ul>
        {messages && messages.length > 0
          ? messages.map((message, index) => {
            return !message || !message.node
              ? renderNoData()
              : (
                <li key={`node-index-${index}`}>
                  <div>{message.node.id}</div>
                  <div>{message.node.content}</div>
                </li>
              )
          })
          : renderNoData()
        }
      </ul>
    )
  }
}

export const GraphQLMessage = () => {
  return (
    <Query query={messageQUERY} variables={{}}>
      {({ loading, data, error, subscribeToMore }) => {
        if (loading) return renderLoading()
        if (error) return renderError()
        if (!data) return renderNoData()
        const { getMessage } = data as GetMessage
        return !getMessage || !getMessage.edges
        ? renderNoData()
        : (
          <div>
            <Messages
              messages={getMessage.edges}
              subscribeToMore={() => subscribeToMore(
                {
                  document: subscriptionMessageSchema,
                  updateQuery: (prev, next) => {
                    if (!next.subscriptionData.data) return prev
                    const newMessage = next.subscriptionData.data
                    return {
                      getMessage: {
                        edges: [
                          ...prev.getMessage.edges,
                          {
                            node: { 
                              ...newMessage.messageCreated.messageEdge.node,
                              __typename: "Message"
                            },
                            __typename: "MessageEdge"
                          },
                        ],
                        __typename: "MessageConnection"
                      },
                    }
                  },
                })}
            />
          </div>
        )
      }}
    </Query>
  )
}

export const App = withStyles(searchStyle)(
  class extends React.Component<Props> {
    render() {
      const { classes } = this.props
      return (
        <Grid container spacing={24}>
          <Grid container item xs={6} spacing={16}>
            <Grid item xs={6}>
              <Paper className={classes.infoPaper}>
                <GraphQLMessage />
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      )
    }
  }
)

export default App
