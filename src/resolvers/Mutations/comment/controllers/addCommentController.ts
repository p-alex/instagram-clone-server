import { Request } from 'express';
import Post from '../../../../models/Post';
import Comment from '../../../../models/Comment';
import { isAuth } from '../../../../security/isAuth';
import { IComment } from '../../../../interfaces';

export const addComment = async (comment: String, postId: string, req: Request) => {
  const { isAuthorized, message, user } = await isAuth(req);
  if (!isAuthorized) return { statusCode: 401, success: false, message, comment: null };
  try {
    // Create new comment
    const newComment = new Comment({
      user: user?.id,
      comment,
      likes: {
        count: 0,
        users: [],
      },
      replies: {
        count: 0,
        replyList: [],
      },
      postedAt: Date.now(),
    });
    // Save new comment to comments collection
    const saveComment: IComment = await newComment.save();
    const findComment = await Comment.findById({ _id: saveComment.id }).populate('user');
    // Add new comment to post's comments array
    const post = await Post.findById({ _id: postId });
    post.comments.count += 1;
    post.comments.userComments = [saveComment.id, ...post.comments.userComments];
    await post.save();
    return {
      statusCode: 201,
      success: true,
      message: 'Comment posted successfully',
      comment: findComment,
    };
  } catch (error: any) {
    return { statusCode: 500, success: false, message: error.message, comment: null };
  }
};
