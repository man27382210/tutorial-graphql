/**
 * @flow
 * @relayHash 462f5f03c5c6d0a60de2fa784f438990
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type MessageInput = {
  content?: ?string,
  author?: ?string,
};
export type CreateMessageMutationVariables = {|
  input: MessageInput
|};
export type CreateMessageMutationResponse = {|
  +createMessage: ?{|
    +messageEdge: ?{|
      +node: ?{|
        +id: string,
        +content: ?string,
        +author: ?string,
      |}
    |}
  |}
|};
export type CreateMessageMutation = {|
  variables: CreateMessageMutationVariables,
  response: CreateMessageMutationResponse,
|};
*/


/*
mutation CreateMessageMutation(
  $input: MessageInput!
) {
  createMessage(input: $input) {
    messageEdge {
      node {
        id
        content
        author
      }
    }
  }
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "input",
    "type": "MessageInput!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "createMessage",
    "storageKey": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input",
        "type": "MessageInput"
      }
    ],
    "concreteType": "MessagePayload",
    "plural": false,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "messageEdge",
        "storageKey": null,
        "args": null,
        "concreteType": "MessageEdge",
        "plural": false,
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
              }
            ]
          }
        ]
      }
    ]
  }
];
return {
  "kind": "Request",
  "operationKind": "mutation",
  "name": "CreateMessageMutation",
  "id": null,
  "text": "mutation CreateMessageMutation(\n  $input: MessageInput!\n) {\n  createMessage(input: $input) {\n    messageEdge {\n      node {\n        id\n        content\n        author\n      }\n    }\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "CreateMessageMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": v1
  },
  "operation": {
    "kind": "Operation",
    "name": "CreateMessageMutation",
    "argumentDefinitions": v0,
    "selections": v1
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'a27ead7b836d8d5d7fa1acfe0e88b545';
module.exports = node;
