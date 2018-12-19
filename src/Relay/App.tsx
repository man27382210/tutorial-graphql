import * as React from 'react';
import { QueryRenderer } from 'react-relay';
import { SWPersonQuery } from './GetSWPersonByPersonID'
import environment from './environment'

export default class App extends React.Component {
  render() {
    return (
      <QueryRenderer
        environment={environment}
        query={SWPersonQuery}
        variables={{personID: 1}}
        render={({error, props}) => {
          if (error) {
            return <div>Error!</div>;
          }
          if (!props) {
            return <div>Loading...</div>;
          }
          return (
            <React.Fragment>
              {props.person}
            </React.Fragment>
          );
        }}
      />
    );
  }
}

// export class Person extends React.Component {
//   render() {
//     const personID = this.props.personID;
//     return (
//       <View>
//         <Checkbox checked={item.isComplete} />
//         <Text>{item.text}</Text>
//         <button onPress={this._refetch} title="Refresh" />
//       </View>
//     );
//   }

//   _refetch = () => {
//     this.props.relay.refetch(
//       {itemID: this.props.item.id},  // Our refetchQuery needs to know the `itemID`
//       null,  // We can use the refetchVariables as renderVariables
//       () => { console.log('Refetch done') },
//       {force: true},  // Assuming we've configured a network layer cache, we want to ensure we fetch the latest data.
//     );
//   }
// }

// export default createRefetchContainer(
//   Person,
//   graphql`
//     fragment TodoItem_item on Todo {
//       text
//       isComplete
//     }
//   `,
//   graphql`
//     # Refetch query to be fetched upon calling `refetch`.
//     # Notice that we re-use our fragment and the shape of this query matches our fragment spec.
//     query TodoItemRefetchQuery($itemID: ID!) {
//       item: node(id: $itemID) {
//         ...TodoItem_item
//       }
//     }
//   `
// );
