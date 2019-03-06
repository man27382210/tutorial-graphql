/**
 * @flow
 * @relayHash 8ab4d4097032242d61437a85d8760bb4
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type messagesFragment$ref = any;
export type getMessagesQueryVariables = {|
  first?: ?number
|};
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
query getMessagesQuery(
  $first: Int
) {
  getMessage(first: $first) {
    ...messagesFragment
  }
}

fragment messagesFragment on MessageConnection {
  edges {
    node {
      id
      author
      content
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
  "text": "query getMessagesQuery(\n  $first: Int\n) {\n  getMessage(first: $first) {\n    ...messagesFragment\n  }\n}\n\nfragment messagesFragment on MessageConnection {\n  edges {\n    node {\n      id\n      author\n      content\n    }\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "getMessagesQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "getMessage",
        "storageKey": null,
        "args": v1,
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
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "getMessage",
        "storageKey": null,
        "args": v1,
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
})();
// prettier-ignore
(node/*: any*/).hash = '8d4514b857924aaf86c37cfa19357d5d';
module.exports = node;
