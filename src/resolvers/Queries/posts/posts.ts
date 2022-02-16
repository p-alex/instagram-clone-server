import { Request } from 'express';
import { getPosts } from './data';

export default {
  getPosts: (_: undefined, __: {}, { req }: { req: Request }) => getPosts(req),
};
