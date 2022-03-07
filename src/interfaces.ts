export interface IUser {
  id: string;
  fullname: string;
  username: string;
  email: string;
  password: string;
  bio: string;
  profilePicture: string;
  posts: IPosts;
  followers: IFollowers;
  following: IFollowing;
  gender: string;
  joinedAt: string;
  refreshToken?: string;
}
export interface IUserProfileInfo {
  userId: string;
  profilePicture: string;
  fullname: string;
  username: string;
  bio: string;
  followers: IFollowers;
  following: IFollowing;
  posts: IPosts;
}
export interface IPostUser {
  id: string;
  username: string;
  profilePicture: string;
}
export interface IPosts {
  count: number;
  postsList: IPost[];
}
export interface IPost {
  id: string;
  user: IPostUser;
  images: IImage[];
  description: string;
  likes: ILikes;
  comments: IComments;
  postedAt: string;
}
export interface IImage {
  fullImage: string;
  croppedImage: string;
}
export interface IComments {
  count: number;
  commentsList: [string];
}
export interface IComment {
  id: string;
  isReply: boolean;
  user: ICommentCreator;
  comment: string;
  likes: string[];
  replies: Comment[];
  postedAt: string;
}
export interface ICommentCreator {
  id: string;
  username: string;
  profilePicture: string;
}
export interface ILikes {
  count: number;
  users: [string];
}
export interface IFollowers {
  count: number;
  followersList: [string];
}
export interface IFollowing {
  count: number;
  followingList: [string];
}
