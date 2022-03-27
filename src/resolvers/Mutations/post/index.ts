import { Request } from 'express';
import { createPost } from './controllers/createPostController';
import { deletePost } from './controllers/deletePostController';
import { likeOrDislikePost } from './controllers/likePostController';

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
  likeOrDislikePost: (
    _: unknown,
    { postId }: { postId: string },
    { req }: { req: Request }
  ) => likeOrDislikePost({ postId, req }),
  deletePost: (
    _: unknown,
    { id, postIndex }: { id: string; postIndex: number },
    { req }: { req: Request }
  ) => deletePost(id, postIndex, req),
};
