import * as React from 'react'
import { Mutation, MutationFn } from 'react-apollo'
import { DataProxy } from 'apollo-cache'
import { createMessageSchema } from './mutation'
import { messageQUERY } from './queries'
import {
  CreateMessageMutation,
  CreateMessageMutationVariables,
} from './--schema/CreateMessageMutation'

import { GetMessage } from './--schema/GetMessage'

class MutationMessage extends Mutation<CreateMessageMutation, CreateMessageMutationVariables> {}
type MessagePayload = "MessagePayload"
type MessageEdge = "MessageEdge"
type Message = "Message"

const updateFucntion = (cache: DataProxy, mutationResult: { data: CreateMessageMutation }) => {
  const { createMessage } = mutationResult.data
  const queryData = cache.readQuery({ query: messageQUERY }) as GetMessage
  if (!queryData || !queryData.getMessage || !queryData.getMessage.edges || !createMessage) return
  queryData.getMessage.edges.push(createMessage.messageEdge)
  cache.writeQuery({
    query: messageQUERY,
    data: { getMessage: queryData.getMessage },
  })
}

export class CreateMessage extends React.Component {
  authorRef = React.createRef<HTMLInputElement>()
  contentRef = React.createRef<HTMLInputElement>()

  render() {
    return (
    <MutationMessage
      mutation={createMessageSchema}
    >
      {(createMessage) => {
        return (
          <>
            <div>
              <input
                ref={this.authorRef}
                type='text'
                placeholder='Author'
              />
              <input
                ref={this.contentRef}
                type='text'
                placeholder='Content'
              />
            </div>
            <div
              onClick={() => this.createMessage(createMessage)}
            >
              submit
            </div>
          </>
        )
      }}
      </MutationMessage>
    )
  }

  createMessage = (createMessage: MutationFn<CreateMessageMutation, CreateMessageMutationVariables>) => {
    if (this.authorRef.current  && this.contentRef.current) {
      const { value: authorValue } = this.authorRef.current
      const { value: contentValue } = this.contentRef.current
      const value = {
        variables: {
          input: {
            content: contentValue,
            author: authorValue 
          }
        },
        optimisticResponse: {
          createMessage: {
            __typename: "MessagePayload" as MessagePayload,
            messageEdge: {
              __typename: "MessageEdge" as MessageEdge,
              node: {
                __typename: "Message" as Message,
                id: 'xxx',
                content: contentValue,
                author: authorValue 
              }
            }
          }
        },
        update: updateFucntion
      }
      createMessage(value)
    }
  }
}
