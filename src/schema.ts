import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type User {
    id: ID!
    fullname: String!
    username: String!
    email: String!
    password: String!
    bio: String
    profilePicture: String
    posts: Posts
    followers: Followers
    following: Following
    gender: String
    joinedAt: String
  }
  type Followers {
    count: Int!
    followersList: [String]
  }
  type Following {
    count: Int!
    followingList: [String]
  }
  type Posts {
    count: Int!
    postsList: [Post]
  }
  type Post {
    id: ID
    user: PostCreator
    images: [Image]
    description: String
    likes: Likes
    comments: Comments
    postedAt: String!
  }
  type Image {
    fullImage: String
    croppedImage: String
  }
  type PostCreator {
    id: ID
    username: String
    profilePicture: String
  }
  type Comments {
    count: Int!
    comments: [Comment]
  }
  type Comment {
    id: ID!
    isReply: Boolean!
    user: CommentCreator!
    comment: String!
    likes: Likes
    replies: [Comment]!
    postedAt: Int!
  }
  type CommentCreator {
    id: ID
    username: String
    profilePicture: String
  }
  type Likes {
    count: Int!
    users: [String]
  }
  type GetUserResponse {
    statusCode: Int
    success: Boolean
    message: String
    user: UserProfileInfo
  }
  type UserProfileInfo {
    userId: ID
    profilePicture: String
    fullname: String
    username: String
    bio: String
    followers: Followers
    following: Following
    posts: Posts
  }
  type GetPostsResponse {
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
    username: String
    profileImg: String
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
    username: String
    profileImg: String
    accessToken: String
  }
  type Error {
    message: String
  }
  type CreatePostResponse {
    statusCode: Int
    success: Boolean
    message: String
    post: Post
  }
  input CreatePostUser {
    id: ID!
    username: String!
    profilePicture: String
  }
  type GetPostResponse {
    statusCode: Int
    success: Boolean
    message: String
    post: Post
  }
  type Query {
    getPosts: GetPostsResponse
    getPost(postId: String!): GetPostResponse
    getUser(username: String!): GetUserResponse
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
    createPost(caption: String, image: String!): CreatePostResponse
  }
`;

export default typeDefs;
