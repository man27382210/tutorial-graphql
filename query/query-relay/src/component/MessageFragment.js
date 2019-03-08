import React from 'react'
import Paper from '@material-ui/core/Paper'
import { createFragmentContainer } from 'react-relay'
import NodeFragment from './NodeFragment'
import { messages as messagesQuery } from '../queries/messages'
import { searchStyle } from '../util/style'

const Messages = searchStyle((props) => {
  const { classes, data: getMessage } = props
  const { edges } = getMessage
  if(!edges || edges.length === 0) return <>Error</>
  return (
    <Paper className={classes.infoPaper}>
      <ul>
        {edges &&
         edges.length > 0
          ? edges.map((edge, index)  => {
            return edge
              ? (
                <li key={`index-${index}`}>
                  <NodeFragment data={edge} />
                </li>
              )
              : null
          })
          : null
        }
      </ul>
    </Paper>
  )
})

export default createFragmentContainer(
  Messages,
  messagesQuery,
)
