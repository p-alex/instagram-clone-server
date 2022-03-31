import { Request } from 'express';
import Comment from '../../../../models/Comment';
import Post from '../../../../models/Post';
import { isAuth } from '../../../../security/isAuth';

export const getComments = async (postId: string, req: Request) => {
  const { isAuthorized, message, user } = await isAuth(req);
  if (!isAuthorized) return { statusCode: 401, success: false, message, comments: null };
  try {
    const post = await Post.findById({ _id: postId });
    const comments = await Comment.find({
      _id: { $in: post.comments.userComments },
    })
      .populate('user')
      .sort({ postedAt: -1 });
    return {
      statusCode: 200,
      success: true,
      message: 'Comments loaded successfully',
      comments,
    };
  } catch (error: any) {
    return { statusCode: 500, success: false, message: error.message, comments: null };
  }
};
