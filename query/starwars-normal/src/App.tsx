import * as React from 'react'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import { withStyles, WithStyles, createStyles } from '@material-ui/core/styles'
import { query as personQuery } from './queries'

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

interface Person {
  person: {[key: string]: string}
  error: boolean
  loading: boolean
  personID: string,
  fetchPerson?: (personID: string) => void,
  graphqlQueryString: string,
}

const PersonState: Person = { 
  person: {},
  error: false,
  loading: true,
  personID: '1',
  graphqlQueryString: personQuery,
}

const PersonContext = React.createContext(PersonState)

export const SearchUser = withStyles(searchStyle)(({ classes }: Props)=> {
  const personIDInput = React.createRef<HTMLInputElement>()
  return (
    <PersonContext.Consumer>
      {({fetchPerson}) => { 
        const submitPerson = () => {
          const personID = personIDInput.current ? personIDInput.current.value : '1'
          if (fetchPerson) fetchPerson(personID)
        }
        return (
          <Paper className={classes.infoPaper}>
            <input ref={personIDInput} defaultValue='1' />
            <button onClick={submitPerson}> GET Person </button>
          </Paper>
        )
      }}
    </PersonContext.Consumer>
  )
})

export const Person = withStyles(searchStyle)(({ classes }: Props)=> {
  const renderLoading:() => JSX.Element = (): JSX.Element  => <Paper className={classes.infoPaper}><div>Loading</div></Paper>
  const renderNoData:() => JSX.Element = (): JSX.Element  => <Paper className={classes.infoPaper}><div>No data</div></Paper>
  return (
      <PersonContext.Consumer>
        {({error, loading, person}) => {
          if (loading) return renderLoading()
          if (error) return renderNoData()
          return (
            <Paper className={classes.infoPaper}>
              <div>{person.name}</div>
              <div>Start ship:</div>
              <ul>
                {person.starshipConnection &&
                 person.starshipConnection['starships'] &&
                 person.starshipConnection['starships'].length > 0
                  ? person.starshipConnection['starships']
                      .map((ship: {[key: string]: string}, shipIndex: number)  => 
                      (
                        <li key={`shipIndex-${shipIndex}`}>
                          <div>{ship.name}</div>
                        </li>
                      ))
                  : null
                }
              </ul>
            </Paper>
          )
        }}
      </PersonContext.Consumer>    
  )
})

class PersonApp extends React.Component<Props, Person> {
  state = PersonState
  public render () {
    const { classes } = this.props
    const { personID } = this.state
    return (
      <PersonContext.Provider
        value={
          {
            fetchPerson: this.fetchPerson,
            ...this.state
          }
        }
      >
         <Grid container spacing={24}>
          <Grid container item xs={12}>
            <Paper>
              Basic POST
            </Paper>
          </Grid>
          <Grid container item xs={6} spacing={16}>
            <Grid item xs={6}>
              <SearchUser />
            </Grid>
            <Grid item xs={6}>
              <Person />
            </Grid>
          </Grid>
          <Grid item xs={6}>
            <Paper>
              <pre className={classes.pre}>
                <code>
                  {personQuery}
                </code>
                <code>
                  {`variables: {
                    "personID": ${personID},
                  }`}
                </code>
              </pre>
            </Paper>
          </Grid>
        </Grid>
      </PersonContext.Provider>
    )
  }
  
  private fetchPerson = (personID: string) => {
    if(fetch) {
      fetch('http://localhost:5000/', 
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query: personQuery,
          variables: {
            "personID": `${personID}`,
          },
        })
      })
      .then((res: Response) => res.json())
      .then((result: {[key: string]: string}) => {
        try {
          const resultObject = {
            person: result.data['person'],
            loading: false,
            error: false,
            personID: personID
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

export default withStyles(searchStyle)(PersonApp)
