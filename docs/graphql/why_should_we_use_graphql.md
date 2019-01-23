# Why should we use GraphQL ?

There are bunch of [article]() talk about cons and props of GraphQL and compare to [REST]() / [RPC](),

here we just bring out example for REST api vs GraphQL use case.

Let's give a request is want to know a person and all vehicle this person has.

Vehicles are store in different table and has a foreign key is person id.

### REST API Usage

To get person and all vehicles, at least you will need two api like this:

```
// Person
/api/person/:id

// Vehicles
/api/vehicles_person/:id

// or stupid way such as below

/api/vehicles/all //-> and filter vehicles which belong to this person in clinet side.

// or in person response we have array of vehicle id, which means you need to request the api below for N times.

/api/vehicle/:id

```
If reuqest for more things such as how many house does this person have, that needs more and more REST api endpoint.

Of course we can use aggregation / composition way to do it, but here we bring out GraphQL and see what's different.

### GraphQL Usage

Type and schema define

```
type Query {
  person: Person
}

type Person {
  id: ID
  name: String
  vehicle: Vehicle
  house: House
}

type Vehicle {
  id: ID
  name: String
  brand: String
  price: Number
}

type House {
  id: ID
  name: String
  price: Number
}

```

Query

```
{
  person {
	name
	vehicle {
	  name
	}
	house {
	  name
	  price
	}
  }
} 
```

Result

```
{
  "person": {
    "name": "Luke Skywalker",
    "vehicles": [
      {
        "name": "Snowspeeder"
      },
      {
        "name": "Imperial Speeder Bike"
      }
    ],
    "house": [
      {
        "name": "Ahch-To",
        "price": 0
      }
    ]
  }
}
```
With GraphQL, one request can get all data back,
no need to call multiple api to get all result.

### Section Summary

This example shows some benefit of using GraphQL instead of REST api,
of course there are lot of different usage such as hybrid REST and made GraphQL as API Gateway.

Next topic we focus on GraphQL terminologies.

### Reference & Others
[REST vs GraphQL](https://blog.goodapi.co/rest-vs-graphql-a-critical-review-5f77392658e7)
