import * as React from 'react'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import { withStyles, WithStyles, createStyles } from '@material-ui/core/styles'
import { query } from './queries'

const searchStyle = () => createStyles({
  pre: {
    margin: 0,
  },
  infoPaper: {
    padding: 20,
    minHeight: 100,
  }
})

interface Props extends WithStyles<typeof searchStyle> {}

type GetMessageType = {
  getMessage?: {
    edges?: [
      {
        node: {
          id: string
          author: string
          content: string
        }
      }
    ]
  }
}

type Message = {
  data: GetMessageType
  error: boolean
  loading: boolean
  fetchMessages?: () => void,
}

type ResultData = Partial<Message>

const MessageState: Message = { 
  data: {},
  error: false,
  loading: true,
}

const MessageContext = React.createContext(MessageState)

export const GetMessage = withStyles(searchStyle)(({ classes }: Props)=> {
  return (
    <MessageContext.Consumer>
      {({ fetchMessages }) => {
        const submitPerson = () => {
          if (fetchMessages) fetchMessages()
        }
        return (
          <Paper className={classes.infoPaper}>
            <button onClick={submitPerson}> GET Messages </button>
          </Paper>
        )
      }}
    </MessageContext.Consumer>
  )
})

export const Messages = withStyles(searchStyle)(({ classes }: Props)=> {
  const renderLoading:() => JSX.Element = (): JSX.Element  => <Paper className={classes.infoPaper}><div>Loading</div></Paper>
  const renderNoData:() => JSX.Element = (): JSX.Element  => <Paper className={classes.infoPaper}><div>No data</div></Paper>
  return (
      <MessageContext.Consumer>
        {({error, loading, data}) => {
          if (loading) return renderLoading()
          if (error) return renderNoData()
          const { getMessage: messages } = data
          if (!messages) return renderNoData()
          const { edges } = messages
          return (
            <Paper className={classes.infoPaper}>
              <ul>
                {edges &&
                 edges.length > 0
                  ? edges.map((edge: {node : {id: string, author: string, content: string}}, index: number)  => 
                      (
                        <li key={`index-${index}`}>
                          <div>{edge.node.id}</div>
                          <div>{edge.node.author}</div>
                          <div>{edge.node.content}</div>
                        </li>
                      ))
                  : null
                }
              </ul>
            </Paper>
          )
        }}
      </MessageContext.Consumer>    
  )
})

class MessageApp extends React.Component<{}, Message> {
  state = MessageState
  public render () {
    return (
      <MessageContext.Provider
        value={
          {
            fetchMessages: this.fetchMessages,
            ...this.state
          }
        }
      >
          <Grid container item xs={6} spacing={16}>
            <Grid item xs={6}>
              <GetMessage />
            </Grid>
            <Grid item xs={6}>
              <Messages />
            </Grid>
          </Grid>
      </MessageContext.Provider>
    )
  }
  
  private fetchMessages = () => {
    if(fetch) {
      fetch('http://localhost:3000/graphql', 
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query,
          variables: {},
        })
      })
      .then((res: Response) => res.json())
      .then((result: ResultData) => {
        try {
          const resultObject = {
            data: result.data
            ? result.data
            : {},
            loading: false,
            error: false,
          }
          this.setState(resultObject)
        } catch {
          throw Error
        }
      })
      .catch((e: Error) => {
        this.setState({loading: false, error: true})
      })
    } else {
      this.setState({loading: false, error: true})
    }
  }
}

export default MessageApp
