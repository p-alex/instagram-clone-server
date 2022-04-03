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
  refreshToken?: string[];
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
export interface IPosts {
  count: number;
  postsList: IPost[];
}
export interface IPost {
  id: string;
  user: ILiteUser;
  images: IImage[];
  description: string;
  likes: ILikes;
  comments: IComments;
  postedAt: string;
}
export interface IImage {
  fullImage: { url: string; public_id: string };
  croppedImage: { url: string; public_id: string };
}
export interface IComments {
  count: number;
  userComments: IComment[];
}
export interface IComment {
  id: string;
  user: ILiteUser;
  comment: string;
  likes: ILikes;
  replies: IReplies;
  postedAt: string;
}
export interface IReply {
  id: string;
  parentComment: IComment;
  user: ILiteUser;
  repliedTo: string;
  reply: string;
  likes: ILikes;
  postedAt: string;
}
export interface ILiteUser {
  _id: string;
  id: string;
  username: string;
  profilePicture: string;
}
export interface IReplies {
  count: number;
  replyList: IReply[];
}
export interface ILikes {
  count: number;
  users: string[];
}
export interface IFollowers {
  count: number;
  followersList: string[];
}
export interface IFollowing {
  count: number;
  followingList: string[];
}
