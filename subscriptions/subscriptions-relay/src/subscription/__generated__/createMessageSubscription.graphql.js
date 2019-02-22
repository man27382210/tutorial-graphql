/**
 * @flow
 * @relayHash dfd283700a4758e8f9fc6fd8c54e019b
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type createMessageSubscriptionVariables = {||};
export type createMessageSubscriptionResponse = {|
  +messageCreated: ?{|
    +messageEdge: ?{|
      +node: ?{|
        +id: string,
        +author: ?string,
        +content: ?string,
      |}
    |}
  |}
|};
export type createMessageSubscription = {|
  variables: createMessageSubscriptionVariables,
  response: createMessageSubscriptionResponse,
|};
*/


/*
subscription createMessageSubscription {
  messageCreated {
    messageEdge {
      node {
        id
        author
        content
      }
    }
  }
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "messageCreated",
    "storageKey": null,
    "args": null,
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
];
return {
  "kind": "Request",
  "operationKind": "subscription",
  "name": "createMessageSubscription",
  "id": null,
  "text": "subscription createMessageSubscription {\n  messageCreated {\n    messageEdge {\n      node {\n        id\n        author\n        content\n      }\n    }\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "createMessageSubscription",
    "type": "Subscription",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": v0
  },
  "operation": {
    "kind": "Operation",
    "name": "createMessageSubscription",
    "argumentDefinitions": [],
    "selections": v0
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '1ec6b2bf76cf3774f04a8f4e88810579';
module.exports = node;
