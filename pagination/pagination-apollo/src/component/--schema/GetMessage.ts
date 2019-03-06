/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetMessage
// ====================================================

export interface GetMessage_getMessageByPage_pageInfo {
  __typename: "PageInfo";
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
  endCursor: string | null;
}

export interface GetMessage_getMessageByPage_edges_node {
  __typename: "Message";
  id: string;
  content: string | null;
  author: string | null;
}

export interface GetMessage_getMessageByPage_edges {
  __typename: "MessageEdge";
  cursor: string | null;
  node: GetMessage_getMessageByPage_edges_node | null;
}

export interface GetMessage_getMessageByPage {
  __typename: "MessageConnection";
  pageInfo: GetMessage_getMessageByPage_pageInfo | null;
  edges: (GetMessage_getMessageByPage_edges | null)[] | null;
  totalCount: number | null;
}

export interface GetMessage {
  getMessageByPage: GetMessage_getMessageByPage | null;
}

export interface GetMessageVariables {
  first?: number | null;
  after?: string | null;
  last?: number | null;
  before?: string | null;
}
