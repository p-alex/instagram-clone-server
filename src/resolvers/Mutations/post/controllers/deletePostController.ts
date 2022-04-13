import { Request } from 'express';
import Comment from '../../../../models/Comment';
import Post from '../../../../models/Post';
import { isAuth } from '../../../../security/isAuth';
import { cloudinary } from '../../../../utils/cloudinary';

export const deletePost = async (postId: string, req: Request) => {
  const { isAuthorized, message, user, userId } = await isAuth(req);
  if (!isAuthorized) return { statusCode: 401, success: false, message };
  try {
    // Delete post from posts colletion
    const post = await Post.findById({ _id: postId });

    if (post.user._id.toString() !== userId)
      return {
        statusCode: 403,
        success: false,
        message: "You can't delete a post that isn't yours...",
      };

    await Post.findByIdAndDelete({ _id: postId });

    //  Delete all the comments associated with the post
    await Comment.remove({ _id: { $in: post.comments.userComments } });

    // Delete post from users collection
    user!.posts.count -= 1;
    user!.posts.postsList = user!.posts.postsList.filter(
      (post: any, index) => post._id.toString() !== postId
    );
    await user!.save();

    // Delete images from cloudinary
    const postFullImagePublic = post.images[0].fullImage.public_id;

    const postCroppedImagePublic = post.images[0].croppedImage.public_id;

    await cloudinary.uploader.destroy(postFullImagePublic);
    await cloudinary.uploader.destroy(postCroppedImagePublic);

    return { statusCode: 200, success: true, message: 'Post deleted successfully' };
  } catch (error: any) {
    return { statusCode: 500, success: false, message: error.message };
  }
};
