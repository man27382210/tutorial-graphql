# Selectors

* [What is reselect?](#what-is-reselect)
* [Create selectors](#why-we-should-use-reselect)
* [Refactor code for container](#refactor-container)

## What is reselect?

[reselect](https://github.com/reduxjs/reselect) is a simple “selector” library for Redux (and others) inspired by getters in [NuclearJS](https://github.com/optimizely/nuclear-js.git), [subscriptions](https://github.com/Day8/re-frame#just-a-read-only-cursor) in [re-frame](https://github.com/Day8/re-frame) and this [proposal](https://github.com/reduxjs/redux/pull/169) from [speedskater](https://github.com/speedskater).

## Why we should use reselect?

* Selectors can compute derived data, allowing Redux to store the minimal possible state.
* Selectors are efficient. A selector is not recomputed unless one of its arguments changes.
* Selectors are composable. They can be used as input to other selectors.

Let have look at `container`'s code we create in prev section

```javascript
// src/examples/ranking/containers/index.js

import { connect } from 'react-redux'
import { fetchGenresIfNeeded, selectGenreId } from '../actions/genres'
import { fetchRankingIfNeeded } from '../actions/ranking'
import Ranking from '../components/index'

// Get ranking data
const getRankingDataByGenre = (ranking, genres) => ranking.data[genres.currentGenreId] || {}

const mapStateToProps = state => {
  const { ranking, genres } = state

  return {
    genresLoading: genres.loading,
    genresData: genres.data,
    genresError: genres.error,
    currentGenreId: genres.currentGenreId,
    rankingLoading: ranking.loading,
    rankingData: getRankingDataByGenre(ranking, genres),
    rankingError: ranking.error
  }
}

export default connect(
  mapStateToProps,
  { fetchGenresIfNeeded, fetchRankingIfNeeded, selectGenreId }
)(Ranking)
```

In above code, `mapStateToProps` calls `getRankingDataByGenre` to get `rankingData` based on `genredId`. There is a drawback: `rankingData` is calculated every time the `state tree` is `updated`. If the state tree is large, or the calculation expensive, repeating the calculation on every update may cause performance problems. `reselect` can help to avoid these unnecessary recalculations.

### Creating a memoized selectors

We can replace `getRankingDataByGenre` with a memoized selector that recalculates `rankingData` when the value of `state.ranking` or `state.genres` changes, but not when changes occur in other (unrelated) parts of the state tree.

`Reselect` provides a function `createSelector` for creating memoized selectors. `createSelector` takes an array of input-selectors and a transform function as its arguments. If the Redux state tree is mutated in a way that causes the value of an input-selector to change, the selector will call its transform function with the values of the input-selectors as arguments and return the result. If the values of the input-selectors are the same as the previous call to the selector, it will return the previously computed value instead of calling the transform function.

Let's define a memoized selector named `selectRankingData` to replace the non-memoized version like:

```javascript

import { createSelector } from 'reselect'

const selectGenres = state => state.genres
const selectRanking = state => state.ranking

// Rename `getRankingDataByGenre` to `selectRankingData`
export const selectRankingData = () => {
  return createSelector(
    selectRanking(),
    selectGenres(),
    (ranking, genres) => ranking.data[`${genres.currentGenreId}`] || {}
  )
}
```

In practice:

**genres.js**

In `src/examples/ichibaRanking/selectors` folder, create file named `genres.js`

```javascript
// src/examples/ranking/selectors/genres.js

import { createSelector } from 'reselect'

export const selectGenres = () => state => state.genres

// Select loading state
export const selectGenresLoading = () =>
  createSelector(selectGenres(), genresState => genresState.loading)

// Select data state
export const selectGenresData = () =>
  createSelector(selectGenres(), genres => [{ id: 0, name: '総合' }, ...genres.data])

// Select error error
export const selectGenresError = () => createSelector(selectGenres(), genres => genres.error)

// Select current displayed genre id
export const selectCurrentGenreId = () =>
  createSelector(selectGenres(), genres => genres.currentGenreId)
```

**rank.js**

In `src/examples/ichibaRanking/selectors` folder, create file named `rank.js`

```javascript
// src/examples/ranking/selectors/rank.js

import { createSelector } from 'reselect'
import { selectCurrentGenreId } from './genres'

export const selectRanking = () => state => state.ranking

// Select loading state
export const selectRankingLoading = () =>
  createSelector(selectRanking(), ranking => ranking.loading)

// Select current displayed genre's ranking data
export const selectRankingData = () =>
  createSelector(
    selectRanking(),
    selectCurrentGenreId(),
    (ranking, currentGenreId) => ranking.data[`${currentGenreId}`] || {}
  )

// Select error
export const selectRankingError = () => createSelector(selectRanking(), ranking => ranking.error)
```

## Refactor container

In `src/examples/ranking/containers/index.js`, includes selectors we created

```javascript
// src/examples/ranking/containers/index.js

.......
import { createSelector } from 'reselect'
import {
  selectGenresLoading,
  selectGenresData,
  selectGenresError,
  selectCurrentGenreId
} from '../selectors/genres'
import { selectRankingLoading, selectRankingData, selectRankingError } from '../selectors/ranking'

.......
```

And then we can replace `mapStateToProps` with `createSelector()` from `reselect`

```javascript
// src/examples/ranking/containers/index.js

export default connect(
  createSelector(
    selectGenresLoading(),
    selectGenresData(),
    selectGenresError(),
    selectCurrentGenreId(),
    selectRankingLoading(),
    selectRankingData(),
    selectRankingError(),
    (
      genresLoading,
      genresData,
      genresError,
      currentGenreId,
      rankingLoading,
      rankingData,
      rankingError
    ) => ({
      genresLoading,
      genresData,
      genresError,
      currentGenreId,
      rankingLoading,
      rankingData,
      rankingError
    })
  ),
  { fetchGenresIfNeeded, fetchRankingIfNeeded, selectGenreId }
)(Ranking)
```

And here is final code for refactored container

```javascript
// src/examples/ranking/containers/index.js

import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import {
  selectGenresLoading,
  selectGenresData,
  selectGenresError,
  selectCurrentGenreId
} from '../selectors/genres'
import { selectRankingLoading, selectRankingData, selectRankingError } from '../selectors/ranking'
import { fetchGenresIfNeeded, selectGenreId } from '../actions/genres'
import { fetchRankingIfNeeded } from '../actions/ranking'
import Ranking from '../components/index'

export default connect(
  createSelector(
    selectGenresLoading(),
    selectGenresData(),
    selectGenresError(),
    selectCurrentGenreId(),
    selectRankingLoading(),
    selectRankingData(),
    selectRankingError(),
    (
      genresLoading,
      genresData,
      genresError,
      currentGenreId,
      rankingLoading,
      rankingData,
      rankingError
    ) => ({
      genresLoading,
      genresData,
      genresError,
      currentGenreId,
      rankingLoading,
      rankingData,
      rankingError
    })
  ),
  { fetchGenresIfNeeded, fetchRankingIfNeeded, selectGenreId }
)(Ranking)
```

We just completed Ichiba ranking app.