/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteFragment } from 'relay-runtime';
type nodeFragment$ref = any;
import type { FragmentReference } from "relay-runtime";
declare export opaque type messagesFragment$ref: FragmentReference;
export type messagesFragment = {|
  +edges: ?$ReadOnlyArray<?{|
    +$fragmentRefs: nodeFragment$ref
  |}>,
  +$refType: messagesFragment$ref,
|};
*/


const node/*: ConcreteFragment*/ = {
  "kind": "Fragment",
  "name": "messagesFragment",
  "type": "MessageConnection",
  "metadata": null,
  "argumentDefinitions": [],
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
          "kind": "FragmentSpread",
          "name": "nodeFragment",
          "args": null
        }
      ]
    }
  ]
};
// prettier-ignore
(node/*: any*/).hash = '3c1f8f6459bdff188209234a6efd04f0';
module.exports = node;
