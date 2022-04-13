import { Request } from 'express';
import { HydratedDocument } from 'mongoose';
import { IComment, IPost } from '../../../../interfaces';
import Comment from '../../../../models/Comment';
import Post from '../../../../models/Post';
import { isAuth } from '../../../../security/isAuth';

export const deleteComment = async (commentId: string, postId: string, req: Request) => {
  const { isAuthorized, message, user } = await isAuth(req);
  if (!isAuthorized) return { statusCode: 401, success: false, message };
  try {
    // Delete comment from comments collection
    const comment: HydratedDocument<IComment> = await Comment.findById({
      _id: commentId,
    });

    if (!comment) throw new Error("That comment doesn't exist");

    if (comment.user._id.toString() !== user!.id) {
      return {
        statusCode: 403,
        success: false,
        message: "You can't delete a comment that isn't yours...",
      };
    }

    await Comment.findByIdAndDelete({
      _id: commentId,
    });

    // Delete comment from post's comments array
    const post: HydratedDocument<IPost> = await Post.findById({ _id: postId });
    post.comments.count -= 1;
    post.comments.userComments = post.comments.userComments.filter(
      (comment: any) => comment._id.toString() !== commentId
    );
    await post.save();
    return { statusCode: 200, success: true, message: 'Commend deleted successfully' };
  } catch (error: any) {
    return { statusCode: 500, success: false, message: error.message };
  }
};
