# Container

Now it's time to hook up React components to Redux store by creating a container. In prepared code, we already have one file called `container.js` in `src/examples/counter/` folder.

In order to connect React component to Redux, we will use `connect()` function from `react-redux`. To use `connect()`, we need to define a function called `mapStateToProps` that tells how to transform the current Redux store state into the props we want to pass to React component we want to wrap (in this case, it's `Counter` component which is defined in `src/examples/counter/index.js`). For example, we need to get current `count` state value from store and pass it down to `Counter` component as props, and we can do like this:

```javascript
const mapStateToProps = state => {
  return {
    count: state.counter.count
  }
}
```

In addition to read state, containers can dispatch actions. In common way, you can create a function called `mapDispatchToProps` that receives the `dispatch()` methods and returns `callback` props that you want to pass down to React component. For example, we want to inject props `increase`, `decrease` to `Counter` component, and we want `increase` to dispatch a `INCREASE` action

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

And finally, we create a container by calling `connect()` and pass those two functions like

```javascript
import { connect } from 'react-redux'
import Counter from './index'
import { increase, decrease } from './action'

const mapStateToProps = state => {
  return {
    count: state.counter.count
  }
}

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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Counter)
```

We can make it shorten by replacing `mapDispatchToProps ` with an object which looks like `{ increase, decrease }`, and `connect` will add `dispatch` automatically.

```javasript
connect(
  mapStateToProps,
  { increase, decrease }
)(Counter)
```

NOTE: You can replace `mapStateToProps ` or `mapDispatchToProps ` with any name you want. In this example here, we are using `mapStateToProps ` and `mapDispatchToProps ` to match the [official documentation](https://redux.js.org/basics/usage-with-react) for easier understanding.
