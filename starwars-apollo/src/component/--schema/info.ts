/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: info
// ====================================================

export interface info_filmConnection_films {
  __typename: "Film";
  /**
   * The title of this film.
   */
  title: string | null;
  /**
   * The episode number of this film.
   */
  episodeID: number | null;
}

export interface info_filmConnection {
  __typename: "PersonFilmsConnection";
  /**
   * A list of all of the objects returned in the connection. This is a convenience
   * field provided for quickly exploring the API; rather than querying for
   * "{ edges { node } }" when no edge data is needed, this field can be be used
   * instead. Note that when clients like Relay need to fetch the "cursor" field on
   * the edge to enable efficient pagination, this shortcut cannot be used, and the
   * full "{ edges { node } }" version should be used instead.
   */
  films: (info_filmConnection_films | null)[] | null;
}

export interface info_starshipConnection_starships {
  __typename: "Starship";
  /**
   * The name of this starship. The common name, such as "Death Star".
   */
  name: string | null;
  /**
   * The class of this starship, such as "Starfighter" or "Deep Space Mobile
   * Battlestation"
   */
  starshipClass: string | null;
}

export interface info_starshipConnection {
  __typename: "PersonStarshipsConnection";
  /**
   * A list of all of the objects returned in the connection. This is a convenience
   * field provided for quickly exploring the API; rather than querying for
   * "{ edges { node } }" when no edge data is needed, this field can be be used
   * instead. Note that when clients like Relay need to fetch the "cursor" field on
   * the edge to enable efficient pagination, this shortcut cannot be used, and the
   * full "{ edges { node } }" version should be used instead.
   */
  starships: (info_starshipConnection_starships | null)[] | null;
  /**
   * A count of the total number of objects in this connection, ignoring pagination.
   * This allows a client to fetch the first five objects by passing "5" as the
   * argument to "first", then fetch the total count so it could display "5 of 83",
   * for example.
   */
  totalCount: number | null;
}

export interface info {
  __typename: "Person";
  /**
   * The ID of an object
   */
  id: string;
  /**
   * The name of this person.
   */
  name: string | null;
  filmConnection: info_filmConnection | null;
  starshipConnection: info_starshipConnection | null;
}
