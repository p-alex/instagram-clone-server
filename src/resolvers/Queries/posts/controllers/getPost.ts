import { IPost } from '../../../../interfaces';
import Post from '../../../../models/Post';

type GetPostResponse = {
  statusCode: number;
  success: boolean;
  message: string;
  post: IPost | null;
};

export const getPost = async (postId: string) => {
  try {
    if (!postId)
      return {
        statusCode: 401,
        success: false,
        message: 'No post id provided',
        post: null,
      };
    const post: GetPostResponse = await Post.findById({ _id: postId }).populate({
      path: 'user',
    });
    if (!post)
      return {
        statusCode: 401,
        success: false,
        message: "That post doesn't exist",
        post: null,
      };
    return { statusCode: 200, success: true, message: 'Post found', post };
  } catch (error: any) {
    return { statusCode: 500, success: false, message: error.message, post: null };
  }
};
