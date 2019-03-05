/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetMessage
// ====================================================

export interface GetMessage_getMessage_edges_node {
  __typename: "Message";
  id: string;
  content: string | null;
  author: string | null;
}

export interface GetMessage_getMessage_edges {
  __typename: "MessageEdge";
  node: GetMessage_getMessage_edges_node | null;
}

export interface GetMessage_getMessage {
  __typename: "MessageConnection";
  edges: (GetMessage_getMessage_edges | null)[] | null;
}

export interface GetMessage {
  getMessage: GetMessage_getMessage | null;
}
