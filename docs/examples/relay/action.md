# Actions

In `src/examples/counter` folder, create a `action.js` file

Then create 2 action creators named `increase` and `decrease`. Both action creators only return a simple action.

```javascript
// src/examples/counter/action.js

import { INCREMENT, DECREMENT } from './constants'

export const increase = () => {
  return {
    type: INCREMENT
  }
}

export const decrease = () => {
  return {
    type: DECREMENT
  }
}
```



