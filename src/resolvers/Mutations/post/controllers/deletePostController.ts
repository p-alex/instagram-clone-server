import { Request } from 'express';
import { IPost, IUser } from '../../../../interfaces';
import Post from '../../../../models/Post';
import { isAuth } from '../../../../security/isAuth';
import { cloudinary } from '../../../../utils/cloudinary';

export const deletePost = async (id: string, postIndex: number, req: Request) => {
  const { isAuthorized, message, user } = await isAuth(req);
  if (!isAuthorized) return { statusCode: 401, success: false, message };
  try {
    // Delete post from posts colletion
    const deletePostResponse: IPost = await Post.findOneAndDelete({ _id: id });
    if (!deletePostResponse?.id) throw new Error("Couldn't delete post");
    const postFullImagePublic = deletePostResponse.images[0].fullImage.public_id;
    const postCroppedImagePublic = deletePostResponse.images[0].croppedImage.public_id;
    // Delete post from users collection
    user!.posts.count -= 1;
    user!.posts.postsList = user!.posts.postsList.filter(
      (post, index) => index !== postIndex
    );
    const updateUserResponse: IUser = await user!.save();
    if (!updateUserResponse?.id) throw new Error("Couldn't update user posts");
    // Delete images from cloudinary
    await cloudinary.uploader.destroy(postFullImagePublic);
    await cloudinary.uploader.destroy(postCroppedImagePublic);
    return { statusCode: 200, success: true, message: 'Post deleted successfully' };
  } catch (error: any) {
    return { statusCode: 500, success: false, message: error.message };
  }
};
