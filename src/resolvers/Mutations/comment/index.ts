import { Request } from 'express';
import { addComment } from '../comment/controllers/addCommentController';
import { likeOrDislikeComment } from './controllers/likeCommentController';
export default {
  addComment: (
    _: unknown,
    { comment, postId }: { comment: string; postId: string },
    { req }: { req: Request }
  ) => addComment(comment, postId, req),
  likeOrDislikeComment: (
    _: unknown,
    { commentId }: { commentId: string },
    { req }: { req: Request }
  ) => likeOrDislikeComment(commentId, req),
};
