import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type User {
    id: ID!
    name: String
    username: String!
    email: String!
    password: String!
    bio: String
    profilePicture: String!
    posts: [Post]!
    followers: [String]
    following: [String]
    gender: String
  }
  type Post {
    id: ID!
    user: User
    images: [Image]!
    description: String
    likes: [Like]
    comments: [Comment]
    postedAt: Int!
  }
  type Comment {
    id: ID!
    isReply: Boolean!
    user: User
    comment: String
    likes: [Like]
    replies: [Comment]
    postedAt: Int!
  }
  type Like {
    userId: ID!
  }
  type Image {
    url: String!
  }
  type Query {
    posts: [Post]
  }
`;

export default typeDefs;
