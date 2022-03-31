import { Request } from 'express';
import { getComments } from './controllers/getCommentsController';

export default {
  getComments: (_: unknown, { postId }: { postId: string }, { req }: { req: Request }) =>
    getComments(postId, req),
};
