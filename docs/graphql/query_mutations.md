# Actions

### Actions

> Actions are plain JavaScript objects that represent payloads of information that send data from your application to your store.

Actions have a type and an optional payload.
Most changes in an application that uses Redux start off with an event that is triggered by a user either directly or indirectly.
Events such as clicking on a button, selecting an item from a dropdown menu, hovering on a particular element or an AJAX request that just returned some data.
Even the initial loading of a page can be an occasion to dispatch an action. Actions are often dispatched by using an action creator.


```javascript
{
  type: SELECT_GENRE,
  genreId
}

```

### Action creator

> An action creator is a function that returns an action object.

Action creators can seem like a superfluous step, but they make things more portable and easy to test.
The action object returned from an action creator is sent to all of the different reducers in the app.
Depending on what the action is, reducers can choose to return a new version of their piece of state.
The newly returned piece of state then gets piped into the application state, which then gets piped back into our React app, which then causes all of our components to re-render.

So lets say when user clicks genre button to see ranking of that genre. It will trigger `selectGenre` action creator and then return action SELECT_GENRE

```javascript
function selectGenre(genreId) {
  return {
    type: SELECT_GENRE,
    genreId
  }
}
```

![reducer](/gitbook/images/action.png)

> Official documentation **[here](https://redux.js.org/basics/actions)**
