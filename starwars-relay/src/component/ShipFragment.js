import React from 'react'
import { createFragmentContainer } from 'react-relay'
import { ShipInfo as ShipInfoQuery } from '../queries/shipInfo'

const ShipInfo = (props) => {
  console.log(props)
  const shipInfo = props.data
  return (<div>{shipInfo.name}</div>)
}

export default createFragmentContainer(
  ShipInfo,
  ShipInfoQuery,
)
