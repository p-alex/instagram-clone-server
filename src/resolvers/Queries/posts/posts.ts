import { Request } from 'express';
import { getPost } from './controllers/getPost';
import { getPosts } from './controllers/getPosts';

export default {
  getPosts: (_: undefined, __: {}, { req }: { req: Request }) => getPosts(req),
  getPost: (_: unknown, { postId }: { postId: string }) => getPost(postId),
};
