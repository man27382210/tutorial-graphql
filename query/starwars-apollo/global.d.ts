declare module 'whatwg-fetch';

declare module "*.graphql" {
  import {DocumentNode} from 'graphql';

  const value: DocumentNode;
  export default value;
}