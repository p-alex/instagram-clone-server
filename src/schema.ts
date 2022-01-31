import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type User {
    id: ID!
    fullName: String
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
  type RegisterUserResponse {
    success: Boolean
    errors: [Error]
    user: User
  }
  type LoginUserResponse {
    success: Boolean
    errors: [Error]
    accessToken: String
  }
  type LogoutUserResponse {
    message: String
  }
  type Error {
    message: String
  }
  type Mutation {
    registerUser(
      fullName: String!
      email: String!
      username: String!
      password: String!
      confirmPassword: String!
    ): RegisterUserResponse
    loginUser(username: String, email: String, password: String): LoginUserResponse
    logoutUser(id: ID!): LogoutUserResponse
  }
`;

export default typeDefs;
