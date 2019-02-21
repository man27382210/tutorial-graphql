import * as React from 'react'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import { withStyles, WithStyles, createStyles } from '@material-ui/core/styles'
import { GetMessage } from './--schema/GetMessage'
import { messageQUERY } from './queries'
import { CreateMessage } from './CreateMessage'
import { Query } from 'react-apollo'

export class QueryMessage extends Query<GetMessage, {}> {}

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

const renderNoData = () => <div>No data</div>
const renderLoading = () => <div>Loading</div>
const renderError = () => <h1>ERROR</h1>

export const GraphQLMessage = () => {
  return (
    <QueryMessage query={messageQUERY} variables={{}}>
      {({ loading, data, error }) => {
        if (loading) return renderLoading()
        if (error) return renderError()
        if (!data) return renderNoData()
        const { getMessage } = data
        return !getMessage || !getMessage.edges
        ? renderNoData()
        : (
          <div>
            <ul>
              {getMessage.edges &&
               getMessage.edges.length > 0
                ? getMessage.edges.map((edge, index) => {
                  return !edge || !edge.node
                   ? renderNoData()
                   : (
                     <li key={`node-index-${index}`}>
                       <div>{edge.node.id}</div>
                       <div>{edge.node.author}</div>
                       <div>{edge.node.content}</div>
                     </li>
                   )
                })
                : renderNoData()
              }
            </ul>
          </div>
        )
      }}
    </QueryMessage>
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
                <CreateMessage />
              </Paper>
            </Grid>
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
