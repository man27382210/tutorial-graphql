# Container

In prepared code, we already have one file called `index.js` in `src/examples/ranking/containers` folder.

Replace old code with:

```javascript
// src/examples/ranking/containers/index.js

import { connect } from 'react-redux'
import { fetchGenresIfNeeded, selectGenreId } from '../actions/genres'
import { fetchRankingIfNeeded } from '../actions/ranking'
import Ranking from '../components/index'
```

Next, create `mapStateToProps` function to pass state from store to components


```javascript
// src/examples/ranking/containers/index.js

...............

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
```

For actions, instead of creating `mapDispatchToProps` function, we can pass an object like `{ fetchGenresIfNeeded, fetchRankingIfNeeded, selectGenreId }`, and `connect()` adds `dispatch` automatically.

```javascript
// src/examples/ranking/containers/index.js

...............

export default connect(
  mapStateToProps,
  { fetchGenresIfNeeded, fetchRankingIfNeeded, selectGenreId }
)(Ranking)
```

Final code for container.

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


