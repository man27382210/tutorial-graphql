/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
import { shipInfoFragment$ref } from "./shipInfoFragment.graphql";
declare const _infoFragment$ref: unique symbol;
export type infoFragment$ref = typeof _infoFragment$ref;
export type infoFragment = {
    readonly id: string;
    readonly name: string | null;
    readonly filmConnection: ({
        readonly films: ReadonlyArray<({
            readonly title: string | null;
            readonly episodeID: number | null;
        }) | null> | null;
    }) | null;
    readonly starshipConnection: ({
        readonly starships: ReadonlyArray<({
            readonly " $fragmentRefs": shipInfoFragment$ref;
        }) | null> | null;
        readonly totalCount: number | null;
    }) | null;
    readonly " $refType": infoFragment$ref;
};



const node: ConcreteFragment = {
  "kind": "Fragment",
  "name": "infoFragment",
  "type": "Person",
  "metadata": null,
  "argumentDefinitions": [],
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
      "name": "name",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "filmConnection",
      "storageKey": null,
      "args": null,
      "concreteType": "PersonFilmsConnection",
      "plural": false,
      "selections": [
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "films",
          "storageKey": null,
          "args": null,
          "concreteType": "Film",
          "plural": true,
          "selections": [
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "title",
              "args": null,
              "storageKey": null
            },
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "episodeID",
              "args": null,
              "storageKey": null
            }
          ]
        }
      ]
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "starshipConnection",
      "storageKey": null,
      "args": null,
      "concreteType": "PersonStarshipsConnection",
      "plural": false,
      "selections": [
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "starships",
          "storageKey": null,
          "args": null,
          "concreteType": "Starship",
          "plural": true,
          "selections": [
            {
              "kind": "FragmentSpread",
              "name": "shipInfoFragment",
              "args": null
            }
          ]
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "totalCount",
          "args": null,
          "storageKey": null
        }
      ]
    }
  ]
};
(node as any).hash = '7c4861b284ce89dc9629674eaad49445';
export default node;
