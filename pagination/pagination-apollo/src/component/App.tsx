import * as React from 'react'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import { withStyles, WithStyles, createStyles } from '@material-ui/core/styles'
import { GetMessage, GetMessageVariables } from './--schema/GetMessage'
import { messageQUERY } from './paginate'
import { Query } from 'react-apollo'

export class QueryMessage extends Query<GetMessage, GetMessageVariables> {}

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
  const variables = { first: 2 }
  return (
    <QueryMessage
      query={messageQUERY}
      variables={variables}
    >
      {({ loading, data, error, fetchMore }) => {
        if (loading) return renderLoading()
        if (error) return renderError()
        if (!data) return renderNoData()
        const { getMessageByPage } = data
        const endCursor = !getMessageByPage || !getMessageByPage.pageInfo || !getMessageByPage.pageInfo.endCursor
          ? ''
          : getMessageByPage.pageInfo.endCursor

        return !getMessageByPage || !getMessageByPage.edges || !getMessageByPage.pageInfo
          ? renderNoData()
          : (
            <div>
              <ul>
                { getMessageByPage.edges &&
                  getMessageByPage.edges.length > 0
                  ? getMessageByPage.edges.map((edge, index) => {
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
              { !getMessageByPage || !getMessageByPage.pageInfo || !getMessageByPage.pageInfo.hasNextPage
                  ? null
                  : <button onClick={() => fetchMore(
                    {
                      query: messageQUERY,
                      variables: {
                        ...variables,
                        after: endCursor,
                      },
                      updateQuery: (prev, next) => {
                        const { fetchMoreResult } = next
                        if (!fetchMoreResult ||
                            !fetchMoreResult.getMessageByPage ||
                            !fetchMoreResult.getMessageByPage.edges ||
                            !fetchMoreResult.getMessageByPage.pageInfo) return prev
                        const prevEdges = !prev.getMessageByPage || !prev.getMessageByPage.edges
                          ? []
                          : prev.getMessageByPage.edges
                        
                        const newEdges = fetchMoreResult.getMessageByPage.edges
                        const pageInfo = fetchMoreResult.getMessageByPage.pageInfo;
                        return {
                          getMessageByPage: {
                              __typename: "MessageConnection",
                              edges: [...prevEdges, ...newEdges],
                              pageInfo
                            }
                          }
                      }
                    })}>Read More</button>
               }
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
