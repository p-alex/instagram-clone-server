import { Request } from 'express';
import { HydratedDocument } from 'mongoose';
import { IPost } from '../../../../interfaces';
import Post from '../../../../models/Post';
import { isAuth } from '../../../../security/isAuth';

export const likeOrDislikePost = async ({
  postId,
  req,
}: {
  postId: string;
  req: Request;
}) => {
  const { isAuthorized, message, userId } = await isAuth(req);
  if (isAuthorized) {
    try {
      const post: HydratedDocument<IPost> = await Post.findById({ _id: postId });
      if (!post.id) throw new Error("That post doesn't exist");

      const isLiked = post.likes.users.includes(userId!);

      if (isLiked) {
        // Dislike post
        post.likes.count -= 1;
        post.likes.users = post.likes.users.filter((id) => id !== userId);
        const response = await post.save();
        if (response?._id)
          return {
            statusCode: 200,
            success: true,
            message: 'Post disliked successfully',
          };
      }
      // Like post
      post.likes.count += 1;
      post.likes.users.unshift(userId!);
      const response = await post.save();
      if (response?._id)
        return { statusCode: 200, success: true, message: 'Post liked successfully' };
      throw new Error('Something went wrong');
    } catch (error: any) {
      return { statusCode: 500, success: false, message: error.message };
    }
  }
  return { statusCode: 401, success: false, message };
};
