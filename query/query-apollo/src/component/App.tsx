import * as React from 'react'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import { withStyles, WithStyles, createStyles } from '@material-ui/core/styles'
import { getMessage as GetMessage, getMessage_getMessage_edges as GetMessageEdges } from './--schema/getMessage'
import { messageQUERY } from './queries'
import { Query } from 'react-apollo'

export class MessageQuery extends Query<GetMessage, {}> {}

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

export const Messages = () => {
  return (
    <MessageQuery query={messageQUERY} variables={{}}>
      {({ loading, data, error }) => {
        if (loading) return renderLoading()
        if (error) return renderError()
        if (!data) return renderNoData()
        const { getMessage: messages } = data
        if (!messages) return renderNoData()
        const { edges } = messages
        return edges ? (
          <div>
            <ul>
              {edges &&
                 edges.length > 0
                  ? edges.map((edge: GetMessageEdges, index: number)  => {
                    return edge && edge.node
                      ? (
                        <li key={`index-${index}`}>
                          <div>{edge.node.author}</div>
                          <div>{edge.node.id}</div>
                          <div>{edge.node.content}</div>
                        </li>
                      )
                      : renderNoData()
                  })
                  : null
                }
            </ul>
          </div>
        ) : renderNoData()
      }}
    </MessageQuery>
  )
}

export const App = withStyles(searchStyle)(
  class extends React.Component<Props, { loading: boolean }> {
    state = {
      loading: true
    }

    submitPerson = () => this.setState({loading: false})

    render() {

      const { classes } = this.props
      const { loading } = this.state
      return (
        <Grid container item xs={6} spacing={16}>
          <Grid item xs={6}>
            <Paper className={classes.infoPaper}>
              <button onClick={this.submitPerson}> GET Message </button>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper className={classes.infoPaper}>
              {!loading
                ? <Messages />
                : renderLoading()
              }
            </Paper>
          </Grid>
        </Grid>
      )
    }
  }
)

export default App
