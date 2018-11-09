# Data flow
Redux architecture revolves around a **strict unidirectional data flow**.

This means that all data in an application follows the same lifecycle pattern, making the logic of your app more predictable and easier to understand.
It also encourages data normalization, so that you don't end up with multiple, independent copies of the same data that are unaware of one another.

### Overview:

> General:

![redux_general_data_flow](/gitbook/images/data_flow_general.png)

> With middleware:

![redux_data_flow_with_middleware](/gitbook/images/data_flow_with_middleware.png)

### The data lifecycle in any Redux app follows these 4 steps:

* Step 1: You call store.dispatch(action).
* Step 2: The Redux store calls the reducer function you gave it.
* Step 3: The root reducer may combine the output of multiple reducers into a single state tree.
* Step 4: The Redux store saves the complete state tree returned by the root reducer.