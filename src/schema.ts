import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type User {
    id: ID!
    fullname: String
    username: String
    email: String
    password: String
    bio: String
    profilePicture: String
    posts: [Post]
    followers: [String]
    following: [String]
    gender: String
  }
  type Post {
    id: ID
    user: User
    images: [Image]
    description: String
    likes: [Like]
    comments: [Comment]
    postedAt: Int
  }
  type Comment {
    id: ID!
    isReply: Boolean!
    user: User!
    comment: String!
    likes: [Like]!
    replies: [Comment]!
    postedAt: Int!
  }
  type Like {
    userId: ID!
  }
  type Image {
    url: String!
  }
  type Query {
    getPosts: PostsResponse
  }
  type PostsResponse {
    statusCode: Int
    success: Boolean
    message: String
    posts: [Post]
  }
  type RegisterUserResponse {
    statusCode: Int
    success: Boolean!
    message: String
    user: User
  }
  type LoginUserResponse {
    statusCode: Int
    success: Boolean
    message: String
    userId: String
    accessToken: String
  }
  type LogoutUserResponse {
    statusCode: Int
    success: Boolean!
    message: String!
  }
  type RefreshTokenResponse {
    statusCode: Int
    success: Boolean
    message: String
    userId: String
    accessToken: String
  }
  type Error {
    message: String
  }
  type Mutation {
    registerUser(
      email: String!
      fullname: String!
      username: String!
      password: String!
      confirmPassword: String!
    ): RegisterUserResponse
    loginUser(username: String!, password: String!): LoginUserResponse
    logoutUser: LogoutUserResponse
    refreshToken: RefreshTokenResponse
  }
`;

export default typeDefs;
