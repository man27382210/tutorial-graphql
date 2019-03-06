import React from 'react'
import { messages as messagesSchema } from '../pagination/messages'
import { getMessagesQuery } from '../pagination/getMessages'
import { createPaginationContainer } from 'react-relay'

const MessagesComponent = props => {
  const { data, relay } = props
  const { getMessageByPage } = data
  const { edges: messages } = getMessageByPage
  const { hasMore, loadMore } = relay
  return (
    <>
      <ul>
        {messages.map((msg, index) => (
          <li key={`message-${index}`}>
            <div>{msg.node.id}</div>
            <div>{msg.node.author}</div>
            <div>{msg.node.content}</div>
          </li>
        ))}
      </ul>
      {hasMore() 
        ? <button onClick={() => loadMore()} >load more</button>
        : null
      }
      
    </>
  )
}

export const MessagePaginationContainer = createPaginationContainer(
  MessagesComponent,
  messagesSchema,
  {
    direction: 'forward',
    query: getMessagesQuery,
    getConnectionFromProps(props) {
      return {
        edges: props.data && props.data.getMessageByPage && props.data && props.data.getMessageByPage.edges,
        pageInfo: {
          ...props.data && props.data.getMessageByPage && props.data.getMessageByPage.pageInfo
        }
      }
    },
    getVariables(props, paginationInfo, fragmentVariables) {
      return {
        ...fragmentVariables,
        after: paginationInfo.cursor,
      }
    },
    getFragmentVariables(previousVariables, totalCount) {
      return {
        ...previousVariables
      }
    },
  }
)
