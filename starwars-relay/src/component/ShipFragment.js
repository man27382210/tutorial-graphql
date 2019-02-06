import React from 'react'
import { createFragmentContainer } from 'react-relay'
import { ShipInfo as ShipInfoQuery } from '../queries/shipInfo'

const ShipInfo = (props) => {
  const shipInfo = props.data
  return <li>{shipInfo.name}</li>
}

export default createFragmentContainer(
  ShipInfo,
  ShipInfoQuery,
)
