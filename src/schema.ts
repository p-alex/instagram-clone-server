import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type Query {
    books: [Book]
  }
  type Book {
    id: ID!
    name: String
    genre: String
  }
`;

export default typeDefs;
