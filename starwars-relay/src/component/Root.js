import React from 'react'
import { QueryRenderer } from 'react-relay'
import { modernEnvironment } from '../env'
import { personQuery } from '../queries/GetSWPersonByPersonID'
import InfoFragment from './InfoFragment'

const PersonQuery = (props) => {
  return (
    <QueryRenderer
      environment={modernEnvironment}
      query={personQuery}
      variables={{personID: props.personID}}
      render={({error, props}) => {
        if (error) {
          return <div>{error}</div>
        }
        if (props && props.person) {
          return <InfoFragment data={props.person}/>
        } else {
          return <div>Loading</div>
        }
      }}
    />
  )
}

export default class PersonApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      personID: null,
    }
    this.idRef = React.createRef();
  }
  render() {
    const { personID } = this.state
    return (
      <>
        <input ref={this.idRef} />
        <button onClick={this.fetchPerson} />
        {personID
          ? <PersonQuery personID={personID} />
          : null}
      </>
    )
  }
  fetchPerson = () => {
    if (this.idRef.current) {
      const { value } = this.idRef.current
      this.setState({ personID: value })
    }
  }
}
