# Actions

**You are highly recommended to read [Middlewares](../../redux/middlewares.md) section before moving next.**

We need to create 2 action files

* [genres.js](#genres-action)
* [ranking.js](#ranking-action)

## Genres action

In `src/examples/ichibaRanking/actions` folder, create file named `genres.js` which includes

```javascript
// src/examples/ichibaRanking/actions/genres.js

import { isEmpty, reduce, includes } from 'lodash'
import { RSAA } from 'redux-api-middleware'
import {
  GENRES_REQUEST,
  GENRES_SUCCESS,
  GENRES_FAILURE,
  SELECT_GENRE
} from '../constants/actionTypes'
import { NO_RANKING_GENRES } from '../constants/base'
import { generateGenresUrl } from '../utils'
```

Add method called `selectGenreId` to select current `genreId`.

```javascript
// src/examples/ichibaRanking/actions/genres.js

......

// Select current genre id
export const selectGenreId = genreId => ({
  type: SELECT_GENRE,
  genreId
})
```

Then, create new method called `shouldFetchGenres` to check if `genres data` is already fetched or not.

```javascript
// src/examples/ichibaRanking/actions/genres.js

......

// Check if genres data is already fetched or not
export const shouldFetchGenres = state => {
  const { data } = state.genres
  if (!isEmpty(data)) return false

  return true
}
```

Create method `fetchGenres` for sending api request.
Check [here](../../redux/middlewares.md#redux-api-middleware) to learn more about `redux-api-middleware`

```javascript
// src/examples/ichibaRanking/actions/genres.js

......

// Fetch genres
export const fetchGenres = () => ({
  [RSAA]: {
    endpoint: generateGenresUrl(),
    method: 'GET',
    types: [
      GENRES_REQUEST,
      {
        type: GENRES_SUCCESS,
        payload: (action, state, res) => {
          return res.json().then(json => {
            // Filter genres which have no ranking data
            return reduce(
              json.children,
              (acc, { genreId, genreName }) => {
                if (!includes(NO_RANKING_GENRES, genreId)) {
                  acc.push({
                    id: genreId,
                    name: genreName
                  })
                }

                return acc
              },
              []
            )
          })
        }
      },
      GENRES_FAILURE
    ]
  }
})
```

Once the resquest is successful, we filter out genres which have no ranking data.

Finally, create last method in this genres action named `fetchGenresIfNeeded`.
This method is used for fetching genres data in React component

```javascript
// src/examples/ichibaRanking/actions/genres.js

......

export const fetchGenresIfNeeded = () => (dispatch, getState) => {
  if (shouldFetchGenres(getState())) {
    dispatch(fetchGenres())
  }
}
```

`fetchGenresIfNeeded` here is a **[curry function](https://en.wikipedia.org/wiki/Currying)** which returns a function in stead of an action like normal Redux `action creator`. If you've already read about `redux-thunk` in [Middlewares](../../redux/middlewares.md#redux-thunk) section, you should know why `fetchGenresIfNeeded`'s returned function has parameters called `dispatch` & `getState`.

By calling `getState()`, we can get current application `state`.
Console log `getState()`, we should see something like this in browser console.

![state_log](/gitbook/images/state_log.png)

If `shouldFetchGenres(getState())` returns `false`, it means genres data is already fetched and no need to fetch it again. Otherwise, `fetchGenres` is dipatched to start fetching data.

And here is final code for `genres.js`

```javascript
// src/examples/ichibaRanking/actions/genres.js

import { isEmpty, reduce, includes } from 'lodash'
import { RSAA } from 'redux-api-middleware'
import {
  GENRES_REQUEST,
  GENRES_SUCCESS,
  GENRES_FAILURE,
  SELECT_GENRE
} from '../constants/actionTypes'
import { NO_RANKING_GENRES } from '../constants/base'
import { generateGenresUrl } from '../utils'

// Select current genre id
export const selectGenreId = genreId => ({
  type: SELECT_GENRE,
  genreId
})

// Check if genres data is already fetched or not
export const shouldFetchGenres = state => {
  const { data } = state.genres
  if (!isEmpty(data)) return false

  return true
}

// Fetch genres
export const fetchGenres = () => ({
  [RSAA]: {
    endpoint: generateGenresUrl(),
    method: 'GET',
    types: [
      GENRES_REQUEST,
      {
        type: GENRES_SUCCESS,
        payload: (action, state, res) => {
          return res.json().then(json => {
            // Filter genres which have no ranking data
            return reduce(
              json.children,
              (acc, { genreId, genreName }) => {
                if (!includes(NO_RANKING_GENRES, genreId)) {
                  acc.push({
                    id: genreId,
                    name: genreName
                  })
                }

                return acc
              },
              []
            )
          })
        }
      },
      GENRES_FAILURE
    ]
  }
})

// Fetch genres based on condition
export const fetchGenresIfNeeded = () => (dispatch, getState) => {
  if (shouldFetchGenres(getState())) {
    dispatch(fetchGenres())
  }
}
```

## Ranking action

In `src/examples/ichibaRanking/actions` folder, create file named `ranking.js` which includes

```javascript
// src/examples/ichibaRanking/actions/ranking.js

import { RSAA } from 'redux-api-middleware'
import { isEmpty } from 'lodash'
import { RANKING_REQUEST, RANKING_SUCCESS, RANKING_FAILURE } from '../constants/actionTypes'
import { generateRankUrl, mapItem, formatDate } from '../utils'
```

Add method called `fetchRanking` for sending api request.

```javascript
// src/examples/ichibaRanking/actions/ranking.js

.....

// Fetch ranking
export const fetchRanking = genreId => ({
  [RSAA]: {
    endpoint: generateRankUrl(genreId),
    method: 'GET',
    types: [
      RANKING_REQUEST,
      {
        type: RANKING_SUCCESS,
        payload: (action, state, res) => {
          return res.json().then(json => {
            const { title, lastBuildDate, Items } = json

            return {
              genreId,
              data: {
                title,
                date: formatDate(lastBuildDate),
                items: mapItem(Items)
              }
            }
          })
        }
      },
      RANKING_FAILURE
    ]
  }
})
```

Once request is successful, returned action payload should include `genreId` and response data.

```javascript
{
  genreId,
  data: {
    title,
    date: formatDate(lastBuildDate),
    items: mapItem(Items)
  }
}
```

When we create ranking `reducer` in next section, `genreId` is used as `key` for caching fetched ranking data.

Next, create method called `shouldFetchRanking`. This method has same duty like `shouldFetchGenres` does in `genres.js`.

```javascript
// src/examples/ichibaRanking/actions/ranking.js

.....

export const shouldFetchRanking = (state, genreId) => {
  const { loading, data } = state.ranking

  // Return false if ranking is already fetched or request is being sent
  if (!isEmpty(data[genreId]) || loading) return false

  return true
}
```

Create final method called `fetchRankingIfNeeded` to use in React component

```javascript
// src/examples/ichibaRanking/actions/ranking.js

.....

// Fetch ranking based on condition
export const fetchRankingIfNeeded = genreId => (dispatch, getState) => {
  if (shouldFetchRanking(getState(), genreId)) {
    dispatch(fetchRanking(genreId))
  }
}
```

And here is final code for `ranking.js`

```javascript
// src/examples/ichibaRanking/actions/ranking.js

import { RSAA } from 'redux-api-middleware'
import { isEmpty } from 'lodash'
import { RANKING_REQUEST, RANKING_SUCCESS, RANKING_FAILURE } from '../constants/actionTypes'
import { generateRankUrl, mapItem, formatDate } from '../utils'

// Fetch ranking
export const fetchRanking = genreId => ({
  [RSAA]: {
    endpoint: generateRankUrl(genreId),
    method: 'GET',
    types: [
      RANKING_REQUEST,
      {
        type: RANKING_SUCCESS,
        payload: (action, state, res) => {
          return res.json().then(json => {
            const { title, lastBuildDate, Items } = json

            return {
              genreId,
              data: {
                title,
                date: formatDate(lastBuildDate),
                items: mapItem(Items)
              }
            }
          })
        }
      },
      RANKING_FAILURE
    ]
  }
})

// Check if ranking is already fetched or not
export const shouldFetchRanking = (state, genreId) => {
  const { loading, data } = state.ranking

  // Return false if ranking is already fetched or request is being sent
  if (!isEmpty(data[genreId]) || loading) return false

  return true
}

// Fetch ranking based on condition
export const fetchRankingIfNeeded = genreId => (dispatch, getState) => {
  if (shouldFetchRanking(getState(), genreId)) {
    dispatch(fetchRanking(genreId))
  }
}
```

## Completed code for actions

Checkout `ranking-actions` for actions completed code

```bash
$ git fetch origin ranking-actions
$ git checkout FETCH_HEAD
```