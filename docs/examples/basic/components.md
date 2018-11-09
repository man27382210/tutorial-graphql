# Components

In prepared code, we already have one file called `index.js` in `src/examples/ranking/components` folder.

Let modify this file like below

```javascript
// src/examples/ranking/components/index

import React, { PureComponent } from 'react'
import { Container } from 'rebass'
import { getGenreId } from '../utils'

export default class Ranking extends PureComponent {
  componentDidMount() {
    const { fetchGenresIfNeeded, fetchRankingIfNeeded, match, selectGenreId } = this.props
    // Fetch all genres for first load
    fetchGenresIfNeeded()

    // Get genre id from url
    const genreId = getGenreId(match)

    // Fetch ranking data based on genreId
    fetchRankingIfNeeded(genreId)

    // Update current selected genreId
    selectGenreId(genreId)
  }

  componentDidUpdate(prevProps) {
    const { selectGenreId, fetchRankingIfNeeded, match } = this.props

    const genreId = getGenreId(match)

    // Update rank data when user navigate
    if (genreId !== getGenreId(prevProps.match)) {
      fetchRankingIfNeeded(genreId)
      selectGenreId(genreId)
    }
  }

  render() {
    return (
      <Container p={[2, 2, 3, 4]}>
        This is ranking page
      </Container>
    )
  }
}
```

In `componentDidMount`, we will fetch `genres` by calling `fetchGenresIfNeeded`.
Next we get `genreId` by calling `getGenreId`, and fetch ranking data by calling `fetchRankingIfNeeded`.
And final, update `currentGenreId` by calling `selectGenreId`

In `componentDidUpdate`, we get current `genreId` from `match` and then compare with prev `genreId`. If they are different, we will fetch new ranking data and update `currentGenreId`.

Next, include all prepared components

```javascript
// src/examples/ranking/components/index

import React, { PureComponent } from 'react'
import { Container } from 'rebass'
import { Flex } from 'grid-styled'
import Title from './title'
import GenresList from './genresList'
import ItemList from './itemsList'
import { getGenreId } from '../utils'

export default class Ranking extends PureComponent {
  componentDidMount() {
    const { fetchGenresIfNeeded, fetchRankingIfNeeded, match, selectGenreId } = this.props
    // Fetch all genres for first load
    fetchGenresIfNeeded()

    // Get genre id from url
    const genreId = getGenreId(match)

    // Fetch ranking data based on genreId
    fetchRankingIfNeeded(genreId)

    // Update current selected genreId
    selectGenreId(genreId)
  }

  componentDidUpdate(prevProps) {
    const { selectGenreId, fetchRankingIfNeeded, match } = this.props

    const genreId = getGenreId(match)

    // Update rank data when user navigate
    if (genreId !== getGenreId(prevProps.match)) {
      fetchRankingIfNeeded(genreId)
      selectGenreId(genreId)
    }
  }

  render() {
    const {
      rankingData,
      genresData,
      selectGenreId,
      currentGenreId,
      genresLoading,
      rankingLoading
    } = this.props

    return (
      <Container p={[2, 2, 3, 4]}>
        <Title loading={rankingLoading} title={rankingData.title} date={rankingData.date} />
        <Flex>
          <GenresList
            loading={genresLoading}
            genres={genresData}
            selectGenreId={selectGenreId}
            currentGenreId={currentGenreId}
          />
          <ItemList items={rankingData.items} loading={rankingLoading} />
        </Flex>
      </Container>
    )
  }
}
```
