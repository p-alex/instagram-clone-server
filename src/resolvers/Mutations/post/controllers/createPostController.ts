import { Request } from 'express';
import { ICreatePostBody } from '..';
import { IPost } from '../../../../interfaces';
import { isAuth } from '../../../../security/isAuth';
import { cloudinary } from '../../../../utils/cloudinary';
import 'dotenv/config';
import Post from '../../../../models/Post';
import User from '../../../../models/User';

interface ICreatePostResponse {
  statusCode: number;
  success: boolean;
  message: string;
}

export const createPost = async (
  { image, caption }: ICreatePostBody,
  req: Request
): Promise<ICreatePostResponse> => {
  const { isAuthorized, message, userId, user } = await isAuth(req);
  if (isAuthorized) {
    // Add image to cloudinary
    try {
      const uploadFullImage = await cloudinary.uploader.upload(image, {
        upload_preset: process.env.CLOUDINARY_POST_IMAGE_UPLOAD_PRESET,
      });
      const uploadCroppedImage = await cloudinary.uploader.upload(image, {
        upload_preset: process.env.CLOUDINARY_POST_IMAGE_UPLOAD_PRESET,
        transformation: [{ width: 293, height: 293, crop: 'thumb' }],
      });
      const fullImageSecureUrl = uploadFullImage.secure_url;
      const croppedImageSecureUrl = uploadCroppedImage.secure_url;
      // Add post to database
      const newPost = new Post({
        user: {
          id: user!.id,
          username: user?.username,
          profilePicture: user?.profilePicture,
        },
        images: [{ fullImage: fullImageSecureUrl, croppedImage: croppedImageSecureUrl }],
        description: caption,
        likes: { count: 0, users: [] },
        comments: { count: 0, userComments: [] },
      });
      const post: IPost = await newPost.save();
      if (post?.postedAt) {
        const user = await User.findById({ _id: userId });
        if (user?.id) {
          const oldPosts = user.posts;
          const newPosts: { count: number; postsList: string[] } = {
            count: oldPosts.count + 1,
            postsList: [post.id!, ...oldPosts.postsList],
          };
          user.posts = newPosts;
          const updatedUser = await user.save();
          if (updatedUser.username) {
            return {
              statusCode: 201,
              success: true,
              message: 'Post created successfully',
            };
          }
        }
      } else {
        return {
          statusCode: 500,
          success: false,
          message: 'Something went wrong',
        };
      }
    } catch (error: any) {
      console.log(error.message);
      return {
        statusCode: 500,
        success: false,
        message: 'Something went wrong',
      };
    }
  }
  return { statusCode: 401, success: false, message: 'Unauthorized' };
};
