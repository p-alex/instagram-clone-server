import { gql } from "apollo-server-express";

const typeDefs = gql`
  type User {
    id: ID!
    fullname: String!
    username: String!
    email: String!
    password: String!
    bio: String
    profilePicture: ProfilePicture
    posts: Posts
    followers: Followers
    following: Following
    gender: String
    createdAt: String
    updatedAt: String
  }
  type ProfilePicture {
    fullPicture: String!
    smallPicture: String!
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
    createdAt: String
    updatedAt: String
    isLiked: Boolean
    isPostOwnerFollowed: Boolean
  }
  type Image {
    fullImage: FullImage
    croppedImage: CroppedImage
  }
  type FullImage {
    url: String!
    public_id: String!
    aspectRatio: Float!
  }
  type CroppedImage {
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
    createdAt: String
    updatedAt: String
  }
  type Likes {
    count: Int!
    users: [String]
  }
  type Replies {
    count: Int!
    userReplies: [String]
  }
  type Reply {
    parentCommentId: String!
    user: LiteUser!
    repliedTo: String!
    reply: String!
    likes: Likes!
    createdAt: String
    updatedAt: String
  }
  type LiteUser {
    id: ID!
    username: String!
    profilePicture: ProfilePicture
  }
  type GetUserResponse {
    statusCode: Int!
    success: Boolean!
    message: String!
    user: UserProfileInfo
    isFollowed: Boolean
    hasFollowings: Boolean
  }
  type UserProfileInfo {
    id: ID
    profilePicture: ProfilePicture
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
    user: AuthUserObject
  }
  type AuthUserObject {
    id: String
    username: String
    email: String
    bio: String
    fullname: String
    profilePicture: ProfilePicture
    hasFollowings: Boolean
    accessToken: String
  }
  type RefreshTokenResponse {
    statusCode: Int!
    success: Boolean!
    message: String!
    user: AuthUserObject
  }
  type Error {
    message: String
  }
  type CreatePostResponse {
    statusCode: Int!
    success: Boolean!
    message: String
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
  type Suggestion {
    id: String!
    username: String!
    profilePicture: ProfilePicture
    isFollowed: Boolean
  }
  type GetSuggestionsResponse {
    statusCode: Int!
    success: Boolean!
    message: String!
    suggestions: [Suggestion]
  }
  type ChangeProfilePictureResponse {
    statusCode: Int!
    success: Boolean!
    message: String!
    newFullPictureUrl: String!
    newSmallPictureUrl: String!
  }
  type RemoveProfilePictureResponse {
    statusCode: Int!
    success: Boolean!
    message: String!
    newPictureUrl: String!
  }
  type Query {
    getPosts: GetPostsResponse
    getPost(postId: ID!, userId: String): GetPostResponse
    getFeedPosts(currentPage: Int!, maxPostsPerPage: Int!): GetPostsResponse
    getUser(username: String!, authenticatedUserId: String): GetUserResponse
    getComments(
      postId: String!
      maxCommentsPerPage: Int!
      currentPage: Int!
    ): GetCommentsResponse
    getSuggestions: GetSuggestionsResponse
  }
  type Mutation {
    registerUser(
      email: String!
      fullname: String!
      username: String!
      password: String!
      confirmPassword: String!
      recaptchaToken: String!
    ): RegisterUserResponse
    confirmEmail(confirmationCode: String!): DefaultResponse
    resetPasswordSendEmail(
      email: String!
      recaptchaToken: String!
    ): DefaultResponse
    verifyResetPasswordToken(token: String!): DefaultResponse
    resetPassword(
      token: String!
      newPassword: String!
      confirmNewPassword: String!
    ): DefaultResponse
    loginUser(username: String!, password: String!): LoginUserResponse
    logoutUser: DefaultResponse
    refreshToken: RefreshTokenResponse
    changePassword(oldPassword: String!, newPassword: String!): DefaultResponse
    createPost(
      caption: String
      image: String!
      aspectRatio: Float!
    ): CreatePostResponse
    likeOrDislikePost(postId: String!): DefaultResponse
    deletePost(postId: String!): DefaultResponse
    addComment(comment: String!, postId: String!): AddCommentResponse
    deleteComment(commentId: String!, postId: String!): DefaultResponse
    likeOrDislikeComment(commentId: String!): DefaultResponse
    followOrUnfollowUser(userId: String!, type: String!): DefaultResponse
    changeProfilePicture(image: String!): ChangeProfilePictureResponse
    removeProfilePicture: RemoveProfilePictureResponse
    editProfile(
      fullname: String!
      username: String!
      bio: String
    ): DefaultResponse
  }
`;

export default typeDefs;
