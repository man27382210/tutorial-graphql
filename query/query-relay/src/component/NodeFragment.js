import React from 'react'
import { createFragmentContainer } from 'react-relay'
import { node as nodeQuery } from '../queries/node'

const Node = (props) => {
  const { data: edge } = props
  const { node } = edge
  if(!node || Object.keys(node).length === 0) return <>Error</>
  return (
    <>
      <div>{node.author}</div>
      <div>{node.id}</div>
      <div>{node.content}</div>
    </>
  )
}

export default createFragmentContainer(
  Node,
  nodeQuery,
)
