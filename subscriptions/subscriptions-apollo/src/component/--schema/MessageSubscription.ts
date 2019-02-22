/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL subscription operation: MessageSubscription
// ====================================================

export interface MessageSubscription_messageCreated_messageEdge_node {
  __typename: "Message";
  id: string;
  author: string | null;
  content: string | null;
}

export interface MessageSubscription_messageCreated_messageEdge {
  __typename: "MessageEdge";
  node: MessageSubscription_messageCreated_messageEdge_node | null;
}

export interface MessageSubscription_messageCreated {
  __typename: "MessagePayload";
  messageEdge: MessageSubscription_messageCreated_messageEdge | null;
}

export interface MessageSubscription {
  messageCreated: MessageSubscription_messageCreated | null;
}
