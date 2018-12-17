/**
 * @flow
 * @relayHash 1e25866a15aaf9b6e720f879eda8a9bf
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type GetSWPersonByPersonIDQueryVariables = {|
  personID?: ?string
|};
export type GetSWPersonByPersonIDQueryResponse = {|
  +person: ?{|
    +id: string,
    +name: ?string,
    +filmConnection: ?{|
      +films: ?$ReadOnlyArray<?{|
        +title: ?string,
        +episodeID: ?number,
      |}>
    |},
  |}
|};
export type GetSWPersonByPersonIDQuery = {|
  variables: GetSWPersonByPersonIDQueryVariables,
  response: GetSWPersonByPersonIDQueryResponse,
|};
*/


/*
query GetSWPersonByPersonIDQuery(
  $personID: ID
) {
  person(personID: $personID) {
    id
    name
    filmConnection {
      films {
        title
        episodeID
        id
      }
    }
  }
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "personID",
    "type": "ID",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "personID",
    "variableName": "personID",
    "type": "ID"
  }
],
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
},
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "title",
  "args": null,
  "storageKey": null
},
v5 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "episodeID",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "operationKind": "query",
  "name": "GetSWPersonByPersonIDQuery",
  "id": null,
  "text": "query GetSWPersonByPersonIDQuery(\n  $personID: ID\n) {\n  person(personID: $personID) {\n    id\n    name\n    filmConnection {\n      films {\n        title\n        episodeID\n        id\n      }\n    }\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "GetSWPersonByPersonIDQuery",
    "type": "Root",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "person",
        "storageKey": null,
        "args": v1,
        "concreteType": "Person",
        "plural": false,
        "selections": [
          v2,
          v3,
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
                  v4,
                  v5
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "GetSWPersonByPersonIDQuery",
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "person",
        "storageKey": null,
        "args": v1,
        "concreteType": "Person",
        "plural": false,
        "selections": [
          v2,
          v3,
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
                  v4,
                  v5,
                  v2
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
(node/*: any*/).hash = 'e9479c541e5039ab1d431236b4d8a916';
module.exports = node;
