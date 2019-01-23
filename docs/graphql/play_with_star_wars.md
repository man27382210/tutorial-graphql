# Play with Star wars GraphQL ?

[Star wars GraphQL API](https://github.com/graphql/swapi-graphql) is based on [Star wars REST API](https://swapi.co/),
which is GraphQL Getway with cache and build with NodeJS.

For more detail, check the link and fork on github.

## Start you local GraphQL dashboard

```
$ cd swapi-graphql/

$ yarn run start

// or

$ ./pm2 start pm2_app.json
```

On [http://localhost:5000](http://localhost:5000) you can see the GraphQL dashboard.

![Dashboard](../gitbook/images/GraphQL_dashboard.png)

On the right bar we can see `Documentation explorer`:

![Documentation_explorer](../gitbook/images/Document_explorer.png)

Which we can go through all schema and see query rule and expect response data type and defined.

Lets see one example `allFilms`

![allFilms_1](../gitbook/images/allFilms_1.png)

![allFilms_2](../gitbook/images/allFilms_2.png)

Leave term `connection` and those arguments for `allFilms` until `Relay` to explain,
here what we see is:

- Before colon is field name and arguments with type.
- After colon is return type.
- Click on the return type, we can see response field we can get.
	![allFilms_3](../gitbook/images/allFilms_3.png)
	- We focus on `Film`, it's a array object, which will return an array of film object. When click on it and we can see more detail.
		- Here we have `title`, `episodeID`...etc, which we can build a query object as below:

Query

```
query {
  allFilms {
    films {
      title
      director
    }
  }
}
```

Response

```
{
  "data": {
    "allFilms": {
      "films": [
        {
          "title": "A New Hope",
          "director": "George Lucas"
        },
        {
          "title": "The Empire Strikes Back",
          "director": "Irvin Kershner"
        },
        {
          "title": "Return of the Jedi",
          "director": "Richard Marquand"
        },
        {
          "title": "The Phantom Menace",
          "director": "George Lucas"
        },
        {
          "title": "Attack of the Clones",
          "director": "George Lucas"
        },
        {
          "title": "Revenge of the Sith",
          "director": "George Lucas"
        },
        {
          "title": "The Force Awakens",
          "director": "J. J. Abrams"
        }
      ]
    }
  }
}
```

## Play yourself

When you try to typing anything on query field, GraphQL will prompt you about what kind of field you can use.

![prompt_image](../gitbook/images/prompt_image.png)

please try to get different information!

Next we will talk about implement in really JS.

