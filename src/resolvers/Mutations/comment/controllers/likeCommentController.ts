import { Request } from 'express';
import { HydratedDocument, Types } from 'mongoose';
import { IComment } from '../../../../interfaces';
import Comment from '../../../../models/Comment';
import { isAuth } from '../../../../security/isAuth';

export const likeOrDislikeComment = async (commentId: string, req: Request) => {
  const { isAuthorized, message, userId } = await isAuth(req);
  if (!isAuthorized) return { statusCode: 401, success: false, message };
  try {
    const comment: HydratedDocument<IComment> = await Comment.findById({
      _id: commentId,
    });

    const convertToObjectId = new Types.ObjectId(userId!).toString();

    const isLiked = comment.likes.users.includes(convertToObjectId);

    if (isLiked) {
      // Dislike comment
      comment.likes.count -= 1;
      comment.likes.users = comment.likes.users.filter(
        (id: any) => id._id.toString() !== convertToObjectId
      );
      await comment.save();
      return {
        statusCode: 200,
        success: true,
        message: 'Post disliked successfully',
      };
    }

    // Like comment
    comment.likes.count += 1;
    comment.likes.users.unshift(userId!);
    await comment.save();
    return { statusCode: 200, success: true, message: 'Comment liked successfully' };
  } catch (error: any) {
    return { statusCode: 500, success: false, message: error.message };
  }
};
