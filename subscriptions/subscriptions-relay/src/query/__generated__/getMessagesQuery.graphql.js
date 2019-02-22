/**
 * @flow
 * @relayHash 1a3b56ceeed55abb23813769d2792c3c
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type getMessagesQueryVariables = {|
  first?: ?number
|};
export type getMessagesQueryResponse = {|
  +getMessage: ?{|
    +edges: ?$ReadOnlyArray<?{|
      +node: ?{|
        +id: string,
        +content: ?string,
        +author: ?string,
      |}
    |}>
  |}
|};
export type getMessagesQuery = {|
  variables: getMessagesQueryVariables,
  response: getMessagesQueryResponse,
|};
*/


/*
query getMessagesQuery(
  $first: Int
) {
  getMessage(first: $first) {
    edges {
      node {
        id
        content
        author
        __typename
      }
      cursor
    }
    pageInfo {
      endCursor
      hasNextPage
    }
  }
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "first",
    "type": "Int",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "edges",
    "storageKey": null,
    "args": null,
    "concreteType": "MessageEdge",
    "plural": true,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "node",
        "storageKey": null,
        "args": null,
        "concreteType": "Message",
        "plural": false,
        "selections": [
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "id",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "content",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "author",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "__typename",
            "args": null,
            "storageKey": null
          }
        ]
      },
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "cursor",
        "args": null,
        "storageKey": null
      }
    ]
  },
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "pageInfo",
    "storageKey": null,
    "args": null,
    "concreteType": "PageInfo",
    "plural": false,
    "selections": [
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "endCursor",
        "args": null,
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "hasNextPage",
        "args": null,
        "storageKey": null
      }
    ]
  }
],
v2 = [
  {
    "kind": "Variable",
    "name": "first",
    "variableName": "first",
    "type": "Int"
  }
];
return {
  "kind": "Request",
  "operationKind": "query",
  "name": "getMessagesQuery",
  "id": null,
  "text": "query getMessagesQuery(\n  $first: Int\n) {\n  getMessage(first: $first) {\n    edges {\n      node {\n        id\n        content\n        author\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n",
  "metadata": {
    "connection": [
      {
        "count": "first",
        "cursor": null,
        "direction": "forward",
        "path": [
          "getMessage"
        ]
      }
    ]
  },
  "fragment": {
    "kind": "Fragment",
    "name": "getMessagesQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": "getMessage",
        "name": "__messages_getMessage_connection",
        "storageKey": null,
        "args": null,
        "concreteType": "MessageConnection",
        "plural": false,
        "selections": v1
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "getMessagesQuery",
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "getMessage",
        "storageKey": null,
        "args": v2,
        "concreteType": "MessageConnection",
        "plural": false,
        "selections": v1
      },
      {
        "kind": "LinkedHandle",
        "alias": null,
        "name": "getMessage",
        "args": v2,
        "handle": "connection",
        "key": "messages_getMessage",
        "filters": null
      }
    ]
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '03a79134e0adb7c793b6e7d30b03fdef';
module.exports = node;
