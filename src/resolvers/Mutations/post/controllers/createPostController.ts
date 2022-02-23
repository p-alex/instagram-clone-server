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
  post: IPost | null;
}

export const createPost = async (
  { image, caption }: ICreatePostBody,
  req: Request
): Promise<ICreatePostResponse> => {
  const { isAuthorized, message, userId } = await isAuth(req);
  if (isAuthorized) {
    // Add image to cloudinary
    try {
      const uploadedResponse = await cloudinary.uploader.upload(image, {
        upload_preset: process.env.CLOUDINARY_POST_IMAGE_UPLOAD_PRESET,
      });
      const secureImageUrl = uploadedResponse.secure_url;
      // Add post to database
      const currentDate = Date.now();
      const newPost = new Post({
        userId,
        images: [secureImageUrl],
        description: caption,
        likes: [],
        comments: [],
        postedAt: currentDate,
      });
      const post = await newPost.save();
      if (post?.postedAt) {
        const userWhoPosted = await User.findById({ _id: userId });
        if (userWhoPosted?.id) {
          const oldPosts = userWhoPosted.posts;
          const newPosts = [
            {
              id: post.id,
              userId,
              images: [secureImageUrl],
              description: caption,
              likes: [],
              comments: [],
              postedAt: currentDate,
            },
            ...oldPosts,
          ];
          userWhoPosted.posts = newPosts;
          const updatedUser = await userWhoPosted.save();
          if (updatedUser.username) {
            return {
              statusCode: 201,
              success: true,
              message: 'Post created successfully',
              post,
            };
          }
        }
      } else {
        return {
          statusCode: 500,
          success: false,
          message: 'Something went wrong',
          post,
        };
      }
    } catch (error: any) {
      console.log(error.message);
      return {
        statusCode: 500,
        success: false,
        message: 'Something went wrong',
        post: null,
      };
    }
  }
  return { statusCode: 401, success: false, message: 'Unauthorized', post: null };
};
