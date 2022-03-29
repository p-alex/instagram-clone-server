import { Request } from 'express';
import { HydratedDocument, Types } from 'mongoose';
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
  if (!isAuthorized) return { statusCode: 401, success: false, message };

  try {
    const post: HydratedDocument<IPost> = await Post.findById({ _id: postId });
    if (!post.id) throw new Error("That post doesn't exist");

    const convertToObjectId = new Types.ObjectId(userId!).toString();

    const isLiked = post.likes.users.includes(convertToObjectId);

    if (isLiked) {
      // Dislike post
      post.likes.count -= 1;
      post.likes.users = post.likes.users.filter(
        (id: any) => id._id.toString() !== userId
      );
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

    if (!response?._id) throw new Error('Something went wrong');
    return { statusCode: 200, success: true, message: 'Post liked successfully' };
  } catch (error: any) {
    return { statusCode: 500, success: false, message: error.message };
  }
};
