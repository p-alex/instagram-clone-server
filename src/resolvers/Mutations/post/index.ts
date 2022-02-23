import { Request } from 'express';
import { createPost } from './controllers/createPostController';

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
};
