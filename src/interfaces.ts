export interface IUser {
  id?: string;
  fullName: string;
  username: string;
  email: string;
  password: string;
  bio: string;
  profilePicture: string;
  posts: IPost[];
  followers: string[];
  following: string[];
  gender: string;
  refreshToken?: string;
}
export interface IPostUser {
  id: string;
  username: string;
  profilePicture: string;
}
export interface IPost {
  id: string;
  postedBy: IPostUser;
  images: string[];
  description: string;
  likes: string[];
  comments: Comment[];
  postedAt: number;
}
export interface IComment {
  id: string;
  isReply: boolean;
  user: IUser;
  comment: string;
  likes: string[];
  replies: Comment[];
  postedAt: number;
}
