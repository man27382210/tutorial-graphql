/* tslint:disable */
// This file was automatically generated and should not be edited.

import { MessageInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: CreateMessageMutation
// ====================================================

export interface CreateMessageMutation_createMessage_messageEdge_node {
  __typename: "Message";
  id: string;
  content: string | null;
  author: string | null;
}

export interface CreateMessageMutation_createMessage_messageEdge {
  __typename: "MessageEdge";
  node: CreateMessageMutation_createMessage_messageEdge_node | null;
}

export interface CreateMessageMutation_createMessage {
  __typename: "MessagePayload";
  messageEdge: CreateMessageMutation_createMessage_messageEdge | null;
}

export interface CreateMessageMutation {
  createMessage: CreateMessageMutation_createMessage | null;
}

export interface CreateMessageMutationVariables {
  input: MessageInput;
}
