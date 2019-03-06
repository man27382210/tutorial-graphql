/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getMessage
// ====================================================

export interface getMessage_getMessage_edges_node {
  __typename: "Message";
  id: string;
  author: string | null;
  content: string | null;
}

export interface getMessage_getMessage_edges {
  __typename: "MessageEdge";
  node: getMessage_getMessage_edges_node | null;
}

export interface getMessage_getMessage {
  __typename: "MessageConnection";
  edges: (getMessage_getMessage_edges | null)[] | null;
}

export interface getMessage {
  getMessage: getMessage_getMessage | null;
}
