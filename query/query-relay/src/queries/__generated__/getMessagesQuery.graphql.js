/**
 * @flow
 * @relayHash a6a40c9c2599f56b196429fe5897bf07
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type messagesFragment$ref = any;
export type getMessagesQueryVariables = {||};
export type getMessagesQueryResponse = {|
  +getMessage: ?{|
    +$fragmentRefs: messagesFragment$ref
  |}
|};
export type getMessagesQuery = {|
  variables: getMessagesQueryVariables,
  response: getMessagesQueryResponse,
|};
*/


/*
query getMessagesQuery {
  getMessage {
    ...messagesFragment
  }
}

fragment messagesFragment on MessageConnection {
  edges {
    ...nodeFragment
  }
}

fragment nodeFragment on MessageEdge {
  node {
    id
    author
    content
  }
}
*/

const node/*: ConcreteRequest*/ = {
  "kind": "Request",
  "operationKind": "query",
  "name": "getMessagesQuery",
  "id": null,
  "text": "query getMessagesQuery {\n  getMessage {\n    ...messagesFragment\n  }\n}\n\nfragment messagesFragment on MessageConnection {\n  edges {\n    ...nodeFragment\n  }\n}\n\nfragment nodeFragment on MessageEdge {\n  node {\n    id\n    author\n    content\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "getMessagesQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "getMessage",
        "storageKey": null,
        "args": null,
        "concreteType": "MessageConnection",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "messagesFragment",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "getMessagesQuery",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "getMessage",
        "storageKey": null,
        "args": null,
        "concreteType": "MessageConnection",
        "plural": false,
        "selections": [
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
                    "name": "author",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "content",
                    "args": null,
                    "storageKey": null
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
};
// prettier-ignore
(node/*: any*/).hash = '161c0a4d5f32dbf7829671179a133cc6';
module.exports = node;
