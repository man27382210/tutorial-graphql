# Reducers

Make one file called `reducer.js` inside `src/examples/counter`

```javascript
// src/examples/counter/reducer.js

import { INCREMENT, DECREMENT } from './constants'

const initialState = {
  count: 0
}

const counterReducer = (state = initialState, action) => {
  switch (action.type) {
    case INCREMENT: {
      return Object.assign({}, state, {
        count: state.count + 1
      })
    }

    case DECREMENT: {
      return Object.assign({}, state, {
        count: state.count - 1
      })
    }

    default: {
      return state
    }
  }
}

export default counterReducer
```

Redux will call reducer with an undefined state for the first time.
But we can replace it with `initialState`

```javascript
const initialState = {
  count: 0
}
```

Reducer above handles actions:

* INCREMENT - update `count` state by increasing 1
* DECREMENT - update `count` state by decreasing 1

**NOTE:**

* Don't mutate the state. State is `immutable`. We must create a copy with `Object.assign()` or use [object spread operator proposal](https://redux.js.org/recipes/using-object-spread-operator) to write `{ ...state, ...newState }` instead. That means you can’t do this:

  ```javascript
  const brokenReducer = (state = initialState, action) => {
    switch (action.type) {
      case INCREMENT: {
        // NO! BAD: This is changing state!
        state.count += 1
        return state
      }

      case DECREMENT: {
        // NO! BAD: This is changing state too!
        state.count -= 1
        return state
      }

      default: {
        // This is fine.
        return state
      }
    }
  }
  ```

* We return the `previous state` in the `default case`. It's important to return the previous state for any unknown action.

Next, switch to `src/reducers.js`. In this file we include `src/example/counter/reducer`, and use `combineReducers ` to combine all reducers in single store

```javascript
// src/reducers.js

import { combineReducers } from 'redux'
import counter from 'examples/counter/reducer'

export default combineReducers({
  counter
})
```