/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteFragment } from 'relay-runtime';
type shipInfoFragment$ref = any;
import type { FragmentReference } from "relay-runtime";
declare export opaque type infoFragment$ref: FragmentReference;
export type infoFragment = {|
  +id: string,
  +name: ?string,
  +filmConnection: ?{|
    +films: ?$ReadOnlyArray<?{|
      +title: ?string,
      +episodeID: ?number,
    |}>
  |},
  +starshipConnection: ?{|
    +starships: ?$ReadOnlyArray<?{|
      +$fragmentRefs: shipInfoFragment$ref
    |}>,
    +totalCount: ?number,
  |},
  +$refType: infoFragment$ref,
|};
*/


const node/*: ConcreteFragment*/ = {
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
// prettier-ignore
(node/*: any*/).hash = '7c4861b284ce89dc9629674eaad49445';
module.exports = node;
