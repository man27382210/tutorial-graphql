/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
declare const _shipInfoFragment$ref: unique symbol;
export type shipInfoFragment$ref = typeof _shipInfoFragment$ref;
export type shipInfoFragment = {
    readonly name: string | null;
    readonly starshipClass: string | null;
    readonly " $refType": shipInfoFragment$ref;
};



const node: ConcreteFragment = {
  "kind": "Fragment",
  "name": "shipInfoFragment",
  "type": "Starship",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "name",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "starshipClass",
      "args": null,
      "storageKey": null
    }
  ]
};
(node as any).hash = '10052a0b9fa2b6554b731370266e422c';
export default node;
