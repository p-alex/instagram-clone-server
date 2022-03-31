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
    user: LiteUser
    images: [Image]
    description: String
    likes: Likes
    comments: Comments
    postedAt: String!
  }
  type Image {
    fullImage: ImageData
    croppedImage: ImageData
  }
  type ImageData {
    url: String!
    public_id: String!
  }
  type Comments {
    count: Int!
    userComments: [String]
  }
  type Comment {
    id: ID
    user: LiteUser
    comment: String
    likes: Likes
    replies: Replies
    postedAt: String
  }
  type Likes {
    count: Int!
    users: [String]
  }
  type Replies {
    count: Int!
    userReplies: [String]
  }
  type LiteUser {
    id: ID!
    username: String!
    profilePicture: String
  }
  type GetUserResponse {
    statusCode: Int!
    success: Boolean!
    message: String!
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
    statusCode: Int!
    success: Boolean!
    message: String!
    posts: [Post]
  }
  type RegisterUserResponse {
    statusCode: Int!
    success: Boolean!
    message: String!
    user: User
  }
  type LoginUserResponse {
    statusCode: Int!
    success: Boolean!
    message: String!
    userId: String
    username: String
    profileImg: String
    accessToken: String
  }
  type RefreshTokenResponse {
    statusCode: Int!
    success: Boolean!
    message: String!
    userId: String
    username: String
    profileImg: String
    accessToken: String
  }
  type Error {
    message: String
  }
  type CreatePostResponse {
    statusCode: Int!
    success: Boolean!
    message: String!
    post: Post
  }
  input CreatePostUser {
    id: ID!
    username: String!
    profilePicture: String
  }
  type GetPostResponse {
    statusCode: Int!
    success: Boolean!
    message: String!
    post: Post
  }
  type GetCommentsResponse {
    statusCode: Int!
    success: Boolean!
    message: String!
    comments: [Comment]
  }
  type AddCommentResponse {
    statusCode: Int!
    success: Boolean!
    message: String!
    comment: Comment
  }
  type DefaultResponse {
    statusCode: Int!
    success: Boolean!
    message: String!
  }
  type Query {
    getPosts: GetPostsResponse
    getPost(postId: ID!): GetPostResponse
    getUser(username: String!): GetUserResponse
    getComments(postId: String!): GetCommentsResponse
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
    logoutUser: DefaultResponse
    refreshToken: RefreshTokenResponse
    createPost(caption: String, image: String!): CreatePostResponse
    likeOrDislikePost(postId: String!): DefaultResponse
    deletePost(postId: String!): DefaultResponse
    addComment(comment: String!, postId: String!): AddCommentResponse
    deleteComment(commentId: String!, postId: String!): DefaultResponse
    likeOrDislikeComment(commentId: String!): DefaultResponse
    addReply(reply: String!, repliedTo: String!, commentId: String!): DefaultResponse
    deleteReply(replyId: String!): DefaultResponse
    likeOrDislikeReply(replyId: String!): DefaultResponse
  }
`;

export default typeDefs;
