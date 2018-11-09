#Let's play with GraphQL client !
In this section,
will base on [swap api](https://swapi.co/) and play/compare with different ways.

## Star wars API
Struct

- Planets
- Spaceships
- Vehicles
- People
- Films
- Species

## Look at one Example
[Luke Skywalker](https://swapi.co/api/people/1)

```
{
	"name": "Luke Skywalker",
	"height": "172",
	"mass": "77",
	"hair_color": "blond",
	"skin_color": "fair",
	"eye_color": "blue",
	"birth_year": "19BBY",
	"gender": "male",
	"homeworld": "https://swapi.co/api/planets/1/",
	"films": [
		"https://swapi.co/api/films/2/",
		"https://swapi.co/api/films/6/",
		"https://swapi.co/api/films/3/",
		"https://swapi.co/api/films/1/",
		"https://swapi.co/api/films/7/"
	],
	"species": [
		"https://swapi.co/api/species/1/"
	],
	"vehicles": [
		"https://swapi.co/api/vehicles/14/",
		"https://swapi.co/api/vehicles/30/"
	],
	"starships": [
		"https://swapi.co/api/starships/12/",
		"https://swapi.co/api/starships/22/"
	],
	"created": "2014-12-09T13:50:51.644000Z",
	"edited": "2014-12-20T21:17:56.891000Z",
	"url": "https://swapi.co/api/people/1/"
}
```

## Problem
In REST api, each detail information needs to aleast one more api call scuh as:

```
...
async function getShipAsync(url) {
    var response = await fetch(url);
    var ship = await response.json();
    return ship;
}

Promise.all(person.starships.map(url =>
    getShipAsync(url)
)).then(ships => {
   console.log(ships)
})
...

```

Of course we can use aggregation either composition,
but in GraphQL world just use nested structure with one call to get all information you want:

```
query {
  person(id: "xxx") {
    id
  	name
    starshipConnection {
      starships {
        name
        id
      }
    }
  }
}
```
You can try on [https://graphql.github.io/swapi-graphql/](https://graphql.github.io/swapi-graphql/)

## Popular Client Library

- [Apollo React Client](https://www.apollographql.com/docs/react/)
- [Relay JS](http://facebook.github.io/relay/en/)

We will start from simple post and go through both library.