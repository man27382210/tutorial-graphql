/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { infoFragment$ref } from "./infoFragment.graphql";
export type GetSWPersonByPersonIDQueryVariables = {
    readonly personID?: string | null;
};
export type GetSWPersonByPersonIDQueryResponse = {
    readonly person: ({
        readonly " $fragmentRefs": infoFragment$ref;
    }) | null;
};
export type GetSWPersonByPersonIDQuery = {
    readonly response: GetSWPersonByPersonIDQueryResponse;
    readonly variables: GetSWPersonByPersonIDQueryVariables;
};



/*
query GetSWPersonByPersonIDQuery(
  $personID: ID
) {
  person(personID: $personID) {
    ...infoFragment
    id
  }
}

fragment infoFragment on Person {
  id
  name
  filmConnection {
    films {
      title
      episodeID
      id
    }
  }
  starshipConnection {
    starships {
      ...shipInfoFragment
      id
    }
    totalCount
  }
}

fragment shipInfoFragment on Starship {
  name
  starshipClass
}
*/

const node: ConcreteRequest = (function(){
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
};
return {
  "kind": "Request",
  "operationKind": "query",
  "name": "GetSWPersonByPersonIDQuery",
  "id": null,
  "text": "query GetSWPersonByPersonIDQuery(\n  $personID: ID\n) {\n  person(personID: $personID) {\n    ...infoFragment\n    id\n  }\n}\n\nfragment infoFragment on Person {\n  id\n  name\n  filmConnection {\n    films {\n      title\n      episodeID\n      id\n    }\n  }\n  starshipConnection {\n    starships {\n      ...shipInfoFragment\n      id\n    }\n    totalCount\n  }\n}\n\nfragment shipInfoFragment on Starship {\n  name\n  starshipClass\n}\n",
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
          {
            "kind": "FragmentSpread",
            "name": "infoFragment",
            "args": null
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
                  },
                  v2
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
                  v3,
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "starshipClass",
                    "args": null,
                    "storageKey": null
                  },
                  v2
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
      }
    ]
  }
};
})();
(node as any).hash = '2ff13744c434eecaf92980b112842799';
export default node;
