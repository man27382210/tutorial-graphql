# Constants

In `src/examples/counter` folder, create a `constants.js` file

```javascript
// src/examples/counter/constants.js

export const INCREMENT = 'INCREMENT'
export const DECREMENT = 'DECREMENT'
```

This file is needed because all the action names are constant and if we create one file, which only exports the naming constant then it is easy for us to define any action without any typos because actions names are on the strings
