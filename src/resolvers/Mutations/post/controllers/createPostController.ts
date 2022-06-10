import { Request } from "express";
import { ICreatePostBody } from "..";
import { IPosts, IUser } from "../../../../interfaces";
import { isAuth } from "../../../../security/isAuth";
import { cloudinary } from "../../../../utils/cloudinary";
import "dotenv/config";
import Post from "../../../../models/Post";

interface ICreatePostResponse {
  statusCode: number;
  success: boolean;
  message: string;
}

export const createPost = async (
  { image, caption, aspectRatio }: ICreatePostBody,
  req: Request
) => {
  const { isAuthorized, message, user } = await isAuth(req);
  if (!isAuthorized) return { statusCode: 401, success: false, message };
  try {
    if (!user?.id) throw new Error("Couldn't find user");

    // Add images to cloudinary
    const uploadFullImage = await cloudinary.uploader.upload(image, {
      upload_preset: process.env.CLOUDINARY_POST_IMAGE_UPLOAD_PRESET,
    });

    const uploadCroppedImage = await cloudinary.uploader.upload(image, {
      upload_preset: process.env.CLOUDINARY_POST_IMAGE_UPLOAD_PRESET,
      transformation: [{ width: 293, height: 293, crop: "thumb" }],
    });

    if (!uploadFullImage.secure_url || !uploadCroppedImage.secure_url)
      throw new Error("Couldn't upload image");

    // Secure image urls
    const fullImageSecureUrl = uploadFullImage.secure_url;
    const croppedImageSecureUrl = uploadCroppedImage.secure_url;

    // Add post to database
    const newPost = new Post({
      user: user.id,
      images: [
        {
          fullImage: {
            url: fullImageSecureUrl,
            public_id: uploadFullImage.public_id,
            aspectRatio,
          },
          croppedImage: {
            url: croppedImageSecureUrl,
            public_id: uploadCroppedImage.public_id,
          },
        },
      ],
      description: caption,
      likes: { count: 0, users: [] },
      comments: { count: 0, userComments: [] },
      postedAt: Date.now(),
    });
    const post = await newPost.save();

    // Add new post ObjectId to user posts and increment count by 1
    const oldPosts = user.posts;
    const newPosts: IPosts = {
      count: oldPosts.count + 1,
      postsList: [post.id!, ...oldPosts.postsList],
    };
    user.posts = newPosts;
    const updatedUser: IUser = await user.save();

    if (updatedUser.id) {
      return {
        statusCode: 201,
        success: true,
        message: "Post created successfully",
      };
    }
  } catch (error: any) {
    return {
      statusCode: 500,
      success: false,
      message: error.message,
    };
  }
};
