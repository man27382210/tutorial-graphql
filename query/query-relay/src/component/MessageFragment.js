import React from 'react'
import Paper from '@material-ui/core/Paper'
import { createFragmentContainer } from 'react-relay'
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
            return edge && edge.node
              ? (
                <li key={`index-${index}`}>
                  <div>{edge.node.author}</div>
                  <div>{edge.node.id}</div>
                  <div>{edge.node.content}</div>
                </li>
              )
              : renderNoData()
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
