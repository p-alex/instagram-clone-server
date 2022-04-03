import { Request } from 'express';
import { addComment } from '../comment/controllers/addCommentController';
import { deleteComment } from './controllers/deleteCommentController';
import { likeOrDislikeComment } from './controllers/likeCommentController';

export interface ICreatePostBody {
  caption: string;
  image: string;
}

export default {
  addComment: (
    _: unknown,
    { comment, postId }: { comment: string; postId: string },
    { req }: { req: Request }
  ) => addComment(comment, postId, req),
  deleteComment: (
    _: unknown,
    { commentId, postId }: { commentId: string; postId: string },
    { req }: { req: Request }
  ) => deleteComment(commentId, postId, req),
  likeOrDislikeComment: (
    _: unknown,
    { commentId }: { commentId: string },
    { req }: { req: Request }
  ) => likeOrDislikeComment(commentId, req),
};
