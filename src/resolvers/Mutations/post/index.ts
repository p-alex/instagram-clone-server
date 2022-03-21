import { Request } from 'express';
import { createPost } from './controllers/createPostController';
import { likePost } from './controllers/likePostController';

export interface ICreatePostBody {
  caption: string;
  image: string;
}

export default {
  createPost: (
    _: unknown,
    { caption, image }: ICreatePostBody,
    { req }: { req: Request }
  ) => createPost({ image, caption }, req),
  likePost: (
    _: unknown,
    { uid, postId }: { uid: string; postId: string },
    { req }: { req: Request }
  ) => likePost({ uid, postId, req }),
};
