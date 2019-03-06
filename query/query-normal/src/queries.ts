export const query = `
query {
  getMessage {
    edges {
      node {
        id
        author
        content
      }
    }
  }
}`
