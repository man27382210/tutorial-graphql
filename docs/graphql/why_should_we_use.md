# Why should we use Redux?

React is great, and it’s entirely possible to write a complete application using nothing but React.

From React 16.3, **[Context](https://reactjs.org/docs/context.html)** was re-written which helps solving a lot of state management issues within React application.

However, as an application gets more complex and bigger, sometimes it’s not as straightforward to use plain old React.

> So what are the alternatives for managing the state of a React component?

Redux is one of them (Others: Flux, Mobx, etc...)

Redux solves a problem that might not be clear in the beginning: it helps giving each React component the exact piece of state it needs.

![redux](/gitbook/images/redux.png)

#### Benefits of using Redux:

* Predictable state updates make it easier to understand how the data flow works in the application
* The use of "pure" reducer functions makes logic easier to test, and enables useful features like "time-travel debugging".
* Centralizing the state makes it easier to implement things like logging changes to the data, or persisting data between page refreshes
* Multiple React components can access the same state but do not have to have any parent/child relationship