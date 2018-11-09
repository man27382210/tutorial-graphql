# Reducers

We need to create 2 reducers in this example

* [genres.js](#genres-reducer)
* [ranking.js](#ranking-reducer)

## Genres reducer

In `src/examples/ichibaRanking/reducers` folder, create file named `genres.js`

```javascript
// src/examples/ichibaRanking/reducers/genres.js

import {
  GENRES_REQUEST,
  GENRES_SUCCESS,
  GENRES_FAILURE,
  SELECT_GENRE
} from '../constants/actionTypes'

export const initialState = {
  loading: false,
  error: '',
  data: [],
  currentGenreId: 0
}

export default (state = initialState, action) => {
  const { type, payload, genreId } = action

  switch (type) {
    case GENRES_REQUEST: {
      return Object.assign({}, state, {
        loading: true
      })
    }

    case GENRES_SUCCESS: {
      return Object.assign({}, state, {
        loading: false,
        data: payload
      })
    }

    case GENRES_FAILURE: {
      return Object.assign({}, state, {
        loading: false,
        error: payload.message
      })
    }

    case SELECT_GENRE: {
      return Object.assign({}, state, {
        currentGenreId: genreId
      })
    }

    default: {
      return state
    }
  }
}
```

`genres` reducer handles 4 actions

* GENRES_REQUEST:
  * Update `loading` state to be `true` to show loading placeholder
* GENRES_SUCCESS
  * Update `loading` state to be `false` to hide loading placeholder
  * Update `data` state with `payload` to display genres list
* GENRES_FAILURE:
  * Update `loading` state to be `false` to hide loading placeholder
  * Update `error` state with error message to hide genres list
* SELECT_GENRE:
  * Update `currentGenreId` with new selected genre.

## Ranking reducer

In `src/examples/ichibaRanking/reducers` folder, create file named `ranking.js`

```javascript
// src/examples/ichibaRanking/reducers/ranking.js

import { RANKING_REQUEST, RANKING_SUCCESS, RANKING_FAILURE } from '../constants/actionTypes'

export const initialState = {
  loading: false,
  error: '',
  data: {}
}

export default (state = initialState, action) => {
  const { type, payload } = action

  switch (type) {
    case RANKING_REQUEST: {
      return Object.assign({}, state, {
        loading: true
      })
    }

    case RANKING_SUCCESS: {
      return Object.assign({}, state, {
        loading: false,
        data: {
          ...state.data,
          [payload.genreId]: payload.data
        }
      })
    }

    case RANKING_FAILURE: {
      return Object.assign({}, state, {
        loading: false,
        error: payload.message
      })
    }

    default: {
      return state
    }
  }
}
```

`ranking` reducer handles 3 actions

* RANKING_REQUEST:
  * Update `loading` state to be `true` to show loading placeholder
* RANKING_SUCCESS
  * Update `loading` state to be `false` to hide loading placeholder
  * Update `data` state by adding new key `payload.genreId` and value `payload.data`
* RANKING_FAILURE:
  * Update `loading` state to be `false` to hide loading placeholder
  * Update `error` state with error message to hide ranking items

## Completed code for reducers

Checkout `ranking-reducers` for reducers completed code

```bash
$ git fetch origin ranking-reducers
$ git checkout FETCH_HEAD
```