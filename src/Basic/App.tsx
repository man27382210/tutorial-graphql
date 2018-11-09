import * as React from 'react';

interface Person {
  person: {[key: string]: string};
  error: boolean;
  loading: boolean;
  fetchPerson?: (personID: string) => void,
}

const PersonState: Person = { 
  person: {},
  error: false,
  loading: true,
};

const PersonContext = React.createContext(PersonState);

  var query = `
  query GetSWPersonByPersonID($personID: ID){
    person(personID: $personID) {
      ...info
    }
  }
  fragment info on Person {
    id
    name
    filmConnection {
      films {
        title
        episodeID
      }
    }
    starshipConnection {
      starships {
        ...shipInfo
      }
      totalCount
    }
  }
  fragment shipInfo on Starship {
      name
      starshipClass
  }
  `;


export const SearchUser: React.SFC<{}> = props => {
  const personIDInput = React.createRef<HTMLInputElement>();
  return (
    <PersonContext.Consumer>
      {({fetchPerson}) => { 
        const submitPerson = () => {
          const personID = personIDInput.current ? personIDInput.current.value : '1';
          if (fetchPerson) fetchPerson(personID);
        }
        return (
        <React.Fragment>
          <input ref={personIDInput} defaultValue='1'/>
          <button onClick={submitPerson}> GET Person </button>
        </React.Fragment>)
      }}
    </PersonContext.Consumer>
  )
}

export const Person: React.SFC<{}> = props => {
  const renderLoading:() => JSX.Element = (): JSX.Element  => <div>Loading</div>;
  const renderNoData:() => JSX.Element = (): JSX.Element  => <div>No data</div>;
  return (
      <PersonContext.Consumer>
        {({error, loading, person}) => {
          if (loading) return renderLoading();
          if (error) return renderNoData();
          return (
            <React.Fragment>  
              <div>{person.name}</div>
              <div>{person.id}</div>
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
            </React.Fragment>
          )
        }}
      </PersonContext.Consumer>    
  );
};

class PersonApp extends React.Component {
  state = PersonState;
  public render () {
    return (
      <PersonContext.Provider
        value={
          {
            fetchPerson: this.fetchPerson,
            ...this.state
          }
        }
      >
        <SearchUser />
        <Person />
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
          query,
          variables: {
            "personID": `${personID}`,
          },
        })
      })
      .then((res: Response) => res.json())
      .then((result: {[key: string]: string}) => {
        this.setState({
          person: result.data['person'],
          loading: false,
          error: false
        })
      })
      .catch((e: Error) => {
        console.log(e)
        this.setState({error: true})
      })
    } else {
      this.setState({error: true})
    }
  }
}

export default PersonApp;
