# Constants
In `src/examples/ichibaRanking/constants` folder, create a file named `actionTypes.js` which includes definition of constant values for action types.

```javascript
// src/examples/ichibaRanking/constants/actionTypes.js

// Genres action types
export const GENRES_REQUEST = 'GENRES_REQUEST'
export const GENRES_SUCCESS = 'GENRES_SUCCESS'
export const GENRES_FAILURE = 'GENRES_SUCCESS'
export const SELECT_GENRE = 'SELECT_GENRE'

// Ranking action types
export const RANKING_REQUEST = 'RANKING_REQUEST'
export const RANKING_SUCCESS = 'RANKING_SUCCESS'
export const RANKING_FAILURE = 'RANKING_FAILURE'
```

In same folder, create one more file named `base.js` which includes base configs for application.

```javascript
// src/examples/ichibaRanking/constants/base.js

// Root api url
export const ROOT_URL = 'https://app.rakuten.co.jp/services/api/'

// Api key
export const API_KEY = '1026955344517130264'

// Secret key
export const SECRET_KEY = 'e68bd23b5adb287997716f00c2ee09b01c8b74a4'

// Affiliate id
export const AFFILIATE_ID = '14f989e4.544e2831.14f989e5.077e6700'

// Genre ids list which have no ranking
export const NO_RANKING_GENRES = [100000, 101114, 101381, 402853]

// Default genre
export const DEFAULT_GENRE = {
  id: 0,
  name: '楽天市場】ランキング市場 【総合】'
}
```