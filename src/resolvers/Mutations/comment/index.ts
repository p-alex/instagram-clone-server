import { Request } from 'express';
import { addComment } from '../comment/controllers/addCommentController';
export default {
  addComment: (
    _: unknown,
    { comment, postId }: { comment: string; postId: string },
    { req }: { req: Request }
  ) => addComment(comment, postId, req),
};
