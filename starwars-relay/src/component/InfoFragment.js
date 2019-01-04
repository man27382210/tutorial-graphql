import React from 'react'
import Paper from '@material-ui/core/Paper';
import { createFragmentContainer } from 'react-relay'
import ShipFragment from './ShipFragment'
import { Info as InfoQuery } from '../queries/info'
import { searchStyle } from '../util/style'

const Info = searchStyle((props) => {
  const { classes, data: person } = props

  return (
    <Paper className={classes.infoPaper}>
      <div>{person.name}</div>
      <ul>
        {person.starshipConnection && person.starshipConnection.starships
          ? person.starshipConnection.starships.map((starShip, starShipIndex) => {
            return <ShipFragment key={`starShip-${starShipIndex}`} data={starShip}/>
          })
          : null
        }
      </ul>
    </Paper>
  )
})

export default createFragmentContainer(
  Info,
  InfoQuery,
)
