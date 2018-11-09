# Component

Now, we have everything ready except React component. Let create one file called `index.js` in `src/examples/counter` folder

```javascript
import React from 'react'
import PropTypes from 'prop-types'
import { Box, Button, Text } from 'rebass'
import { Flex } from 'grid-styled'
import { Title } from 'components/styledComponents'

const Counter = ({ increase, decrease, count }) => (
  <Box pt={[2, 4]} pb={[2, 4]} w="100%">
    <Title align="center" mb={4}>
      Counter
    </Title>
    <Flex alignItems="center" align="center" justifyContent="center">
      <Button mr={3} onClick={decrease} bg="orange4">
        -
      </Button>
      <Text f={4}>{count}</Text>
      <Button ml={3} onClick={increase} bg="orange4">
        +
      </Button>
    </Flex>
  </Box>
)

Counter.propTypes = {
  count: PropTypes.number,
  increase: PropTypes.func,
  decrease: PropTypes.func
}

export default Counter
```

You can ignore stuffs like `rebass` or `styled-components` here, because they are not related to Redux. Just focus on `props` we pass to `Counter` component.

* `count` is a `Number` which is passed from container through `mapStateToProps`

  ```javascript
  const mapStateToProps = state => {
    return {
      count: state.counter.count
    }
  }
  ```

* `increase` & `decrease` are `Function`, which are passed from container through `mapDispatchToProps `

  ```javascript
  const mapDispatchToProps = dispatch => {
    return {
      increase: () => {
        dispatch(increase())
      },
      decrease: () => {
        dispatch(decrease())
      }
    }
  }
  ```

And that is. We just finished creating Counter app with Redux.