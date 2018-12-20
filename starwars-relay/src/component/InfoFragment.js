import React from 'react'
import { createFragmentContainer } from 'react-relay'
import ShipFragment from './ShipFragment'
import { Info as InfoQuery } from '../queries/info'

const Info = (props) => {
  const person = props.data
  console.log(person.starshipConnection)
  console.log(person.starshipConnection.starships)
  return (
    <div>
      {person.name}
      {person.starshipConnection && person.starshipConnection.starships
        ? person.starshipConnection.starships.map((starShip, starShipIndex) => {
          return (<ShipFragment key={`starShip-${starShipIndex}`} data={starShip}/>)
        })
        : null
      }
    </div>
  )
}

export default createFragmentContainer(
  Info,
  InfoQuery,
)
