import { Request } from 'express';
import { createPost } from './controllers/createPostController';

interface ICreatePostUser {
  id: string;
  username: string;
  profilePicture: string;
}

export interface ICreatePostBody {
  user: ICreatePostUser;
  caption: string;
  image: string;
}

export default {
  createPost: (
    _: unknown,
    { user, caption, image }: ICreatePostBody,
    { req }: { req: Request }
  ) => createPost({ user, image, caption }, req),
};
