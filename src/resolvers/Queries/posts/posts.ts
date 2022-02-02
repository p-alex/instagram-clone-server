import { Request } from 'express';
import { getPosts } from './data';

export default {
  posts: (_: undefined, __: {}, { req }: { req: Request }) => getPosts(req),
};
